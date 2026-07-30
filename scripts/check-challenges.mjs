#!/usr/bin/env node
/**
 * Fixtures for the Code Lab checker.
 *
 * Two failure modes, and the second is the cruel one:
 *
 *   1. A challenge whose own reference solution does not pass its checks —
 *      literally unsolvable.
 *   2. A checker so strict that a correct answer written a different way is
 *      marked wrong. A child who solved it and was told they did not will
 *      believe the computer over themselves.
 *
 * ALTERNATIVES below are correct solutions written the way a real child might
 * write them. They must all pass.
 *
 * Usage: node scripts/check-challenges.mjs
 */
import { codeChallenges } from '../src/data/code-challenges.ts';
import { evaluateCode, stripComments } from '../src/lib/code-lab.ts';

let failures = 0;

function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

const byId = Object.fromEntries(codeChallenges.map((c) => [c.id, c]));

console.log('== every reference solution solves its own challenge ==');
for (const challenge of codeChallenges) {
  const { results, solved } = evaluateCode(challenge, challenge.solution);
  const missed = results.filter((r) => !r.passed).map((r) => r.label);
  report(solved, challenge.id, missed.join(', '));
}

console.log('\n== untouched starter code never counts as solved ==');
for (const challenge of codeChallenges) {
  const { solved, untouched } = evaluateCode(challenge, challenge.starterCode);
  report(!solved && untouched, challenge.id);
}

console.log('\n== an empty editor is not a solution ==');
for (const challenge of codeChallenges) {
  report(!evaluateCode(challenge, '   \n  ').solved, challenge.id);
}

/** Correct answers written differently. Every one must be accepted. */
const ALTERNATIVES = {
  'hello-world': ["print('Hello, World!')", 'print("hello world")', 'print( "Hello,  World!" )'],
  'number-guess': [
    `secret = 42
for attempt in range(10):
    guess = int(input("guess? "))
    if guess > secret:
        print("lower")
    elif guess < secret:
        print("higher")
    else:
        print("yes!")
        break`,
  ],
  'prime-checker': [
    `def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True`,
  ],
  fibonacci: [
    `def fibonacci(n):
    a, b = 0, 1
    out = []
    while len(out) < n:
        out.append(a)
        a, b = b, a + b
    return out`,
  ],
  calculator: [
    `def calculate(a, b, operation):
    try:
        if operation == '+':
            return a + b
        elif operation == '-':
            return a - b
        elif operation == '*':
            return a * b
        elif operation == '/':
            return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"`,
  ],
};

console.log('\n== a correct answer written another way is still correct ==');
for (const [id, samples] of Object.entries(ALTERNATIVES)) {
  const challenge = byId[id];
  samples.forEach((code, index) => {
    const { results, solved } = evaluateCode(challenge, code);
    const missed = results.filter((r) => !r.passed).map((r) => r.label);
    report(solved, `${id} #${index + 1}`, missed.join(', '));
  });
}

console.log('\n== comments cannot fake a solution ==');
{
  const challenge = byId['prime-checker'];
  const cheat =
    '# def is_prime(n): use % and a for loop and return True and return False\nprint("hi")';
  report(!evaluateCode(challenge, cheat).solved, 'commented-out keywords do not count');

  report(
    stripComments('print("#1 fan")  # a real comment').trim() === 'print("#1 fan")',
    '# inside a string survives',
    stripComments('print("#1 fan")  # a real comment').trim(),
  );

  report(
    stripComments('x = """\n# not a comment\n"""').includes('# not a comment'),
    '# inside a triple-quoted string survives',
  );
}

console.log(
  `\n${failures === 0 ? '✔ every challenge is solvable and fair' : `✖ ${failures} failure(s)`}`,
);
process.exit(failures === 0 ? 0 : 1);
