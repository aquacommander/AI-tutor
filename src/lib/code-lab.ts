import type { CodeChallenge } from '@/data/code-challenges';

/**
 * Checking a child's Python without running any Python.
 *
 * Real execution needs Pyodide, which is a 6 MB download and a v1.2 item. Until
 * then the Code Lab reads the code for the ideas each challenge is teaching and
 * reports back as a checklist, so a partly-correct attempt still shows what it
 * got right instead of just failing.
 *
 * That means the checks have to be *generous*. A child who solves a challenge a
 * way we did not anticipate and is told they are wrong learns the wrong lesson,
 * so every pattern below accepts a family of answers rather than one.
 */

export interface CheckResult {
  label: string;
  passed: boolean;
}

export interface Evaluation {
  results: CheckResult[];
  solved: boolean;
  /** True when the starter code is untouched — worth a different message. */
  untouched: boolean;
}

/**
 * Removes `#` comments so a checklist cannot be satisfied by writing
 * "# use a while loop" — while leaving `#` inside strings alone, because
 * `print("#1 fan")` is real code.
 */
export function stripComments(code: string): string {
  let out = '';

  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    if (ch === undefined) break;

    if (ch === '"' || ch === "'") {
      const triple = code.slice(i, i + 3);
      const delimiter = triple === ch.repeat(3) ? triple : ch;
      const end = code.indexOf(delimiter, i + delimiter.length);

      // An unterminated string means they are still typing; keep the rest as-is.
      if (end === -1) return out + code.slice(i);

      out += code.slice(i, end + delimiter.length);
      i = end + delimiter.length - 1;
      continue;
    }

    if (ch === '#') {
      const newline = code.indexOf('\n', i);
      if (newline === -1) return out;
      out += '\n';
      i = newline;
      continue;
    }

    out += ch;
  }

  return out;
}

const normalise = (code: string) => code.replace(/\s+/g, ' ').trim();

export function evaluateCode(challenge: CodeChallenge, code: string): Evaluation {
  const untouched = code.trim().length === 0 || normalise(code) === normalise(challenge.starterCode);
  const body = stripComments(code);

  const results = challenge.checks.map((check) => ({
    label: check.label,
    // Regex literals in the data file carry no /g, so `lastIndex` never leaks
    // between calls and a re-check gives the same answer as the first check.
    passed: !untouched && check.pattern.test(body),
  }));

  return { results, solved: results.every((result) => result.passed), untouched };
}
