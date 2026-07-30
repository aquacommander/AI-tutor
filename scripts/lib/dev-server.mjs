/**
 * Boots a throwaway `next dev` for the check scripts.
 *
 * The subtlety worth writing down: `npx next dev` is two processes. Sending
 * SIGTERM to the `npx` wrapper leaves the actual Next server holding the port,
 * so the next run dies with EADDRINUSE — which is exactly what happened the
 * first time these scripts ran twice in a row. Spawning detached puts the pair
 * in their own process group, and signalling the negative pid takes down both.
 */
import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

export async function startDevServer({ port, dist, env = {}, timeoutMs = 120_000 }) {
  const base = `http://127.0.0.1:${port}`;

  // A dist left behind by a run that was interrupted would otherwise be reused.
  await rm(dist, { recursive: true, force: true });

  const child = spawn('npx', ['next', 'dev', '-p', String(port)], {
    env: { ...process.env, NEXT_DIST_DIR: dist, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  let log = '';
  child.stdout.on('data', (chunk) => (log += chunk));
  child.stderr.on('data', (chunk) => (log += chunk));

  let stopped = false;
  const stop = async () => {
    if (stopped) return;
    stopped = true;

    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }

    // Give it a moment to release the port, then insist.
    const exited = await Promise.race([
      new Promise((resolve) => child.once('exit', () => resolve(true))),
      new Promise((resolve) => setTimeout(() => resolve(false), 4_000)),
    ]);
    if (!exited) {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        /* already gone */
      }
    }

    await rm(dist, { recursive: true, force: true });
  };

  // Ctrl-C during a check should not leave a server behind either.
  const onSignal = () => {
    void stop().finally(() => process.exit(130));
  };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(base, { signal: AbortSignal.timeout(4_000) })).ok) {
        return { base, stop, getLog: () => log };
      }
    } catch {
      /* not up yet */
    }
    if (child.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await stop();
  throw new Error(`dev server on ${port} never became ready\n${log.slice(-2000)}`);
}
