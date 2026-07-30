import type { LessonDifficulty } from '@/types/course';

export interface ChallengeCheck {
  /** Written as something the child can read and act on, not as a rule name. */
  label: string;
  /** No `/g` flag anywhere — a stateful regex would give different answers on a re-check. */
  pattern: RegExp;
}

export interface CodeChallenge {
  id: string;
  title: string;
  difficulty: LessonDifficulty;
  xpReward: number;
  /** One line, shown in the challenge list. */
  brief: string;
  /** The task, in steps. Kept short: long instructions do not get read. */
  instructions: string[];
  starterCode: string;
  checks: ChallengeCheck[];
  /** Shown only after the challenge is solved, as one way of many. */
  solution: string;
}

export const codeChallenges: CodeChallenge[] = [
  {
    id: 'hello-world',
    title: 'Hello, World!',
    difficulty: 'beginner',
    xpReward: 50,
    brief: 'Every programmer starts here. Make the computer say hello.',
    instructions: [
      'Use print() to show a message on the screen.',
      'Make it say exactly: Hello, World!',
    ],
    starterCode: '# Make the computer say hello\n',
    checks: [
      { label: 'Uses print() to show something', pattern: /print\s*\(/ },
      {
        label: 'Says "Hello, World!"',
        pattern: /print\s*\(\s*(['"])\s*hello\s*,?\s*world\s*!?\s*\1\s*\)/i,
      },
    ],
    solution: 'print("Hello, World!")',
  },
  {
    id: 'number-guess',
    title: 'Number Guessing Game',
    difficulty: 'beginner',
    xpReward: 75,
    brief: 'The computer picks a secret number. Keep guessing until you get it.',
    instructions: [
      'Pick a secret number and store it in a variable.',
      'Use a loop so the player can guess more than once.',
      'Read a guess with input() and turn it into a number with int().',
      'Tell the player if their guess is too high or too low.',
    ],
    starterCode: 'secret = 7\n\n# Keep asking until they guess it\n',
    checks: [
      { label: 'Keeps going with a loop', pattern: /\b(while|for)\b/ },
      { label: 'Asks the player for a guess with input()', pattern: /input\s*\(/ },
      { label: 'Turns the answer into a number with int()', pattern: /int\s*\(/ },
      { label: 'Compares the guess using < or >', pattern: /[<>]/ },
      { label: 'Says something back with print()', pattern: /print\s*\(/ },
    ],
    solution: `secret = 7

while True:
    guess = int(input("Guess my number: "))
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
    else:
        print("You got it!")
        break`,
  },
  {
    id: 'prime-checker',
    title: 'Prime Number Checker',
    difficulty: 'intermediate',
    xpReward: 100,
    brief: 'A prime number can only be divided by 1 and itself. Find out which is which.',
    instructions: [
      'Write a function called is_prime that takes one number.',
      'Numbers below 2 are never prime.',
      'Check every smaller number to see if it divides evenly, using %.',
      'Return True if nothing divides it, False if something does.',
    ],
    starterCode: 'def is_prime(number):\n    # Your code here\n    pass\n\nprint(is_prime(7))\n',
    checks: [
      { label: 'Defines a function called is_prime', pattern: /def\s+is_prime\s*\(/ },
      { label: 'Uses % to test for a remainder', pattern: /%/ },
      { label: 'Checks the smaller numbers with a loop', pattern: /\b(for|while)\b/ },
      { label: 'Returns True and False', pattern: /return\s+True/i },
      { label: 'Returns False somewhere too', pattern: /return\s+False/i },
    ],
    solution: `def is_prime(number):
    if number < 2:
        return False
    for divisor in range(2, number):
        if number % divisor == 0:
            return False
    return True

print(is_prime(7))`,
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    difficulty: 'intermediate',
    xpReward: 100,
    brief: '1, 1, 2, 3, 5, 8… every number is the two before it added together.',
    instructions: [
      'Write a function called fibonacci that takes how many numbers to make.',
      'Start with 0 and 1.',
      'Each new number is the two before it added together.',
      'Print or return the sequence when you are done.',
    ],
    starterCode: 'def fibonacci(count):\n    # Your code here\n    pass\n\nprint(fibonacci(10))\n',
    checks: [
      { label: 'Defines a function called fibonacci', pattern: /def\s+fibonacci\s*\(/ },
      { label: 'Repeats the step with a loop', pattern: /\b(for|while)\b/ },
      { label: 'Adds two values together with +', pattern: /\+/ },
      { label: 'Gives an answer back with return', pattern: /\breturn\b/ },
    ],
    solution: `def fibonacci(count):
    sequence = []
    current, next_value = 0, 1
    for _ in range(count):
        sequence.append(current)
        current, next_value = next_value, current + next_value
    return sequence

print(fibonacci(10))`,
  },
  {
    id: 'calculator',
    title: 'Simple Calculator',
    difficulty: 'advanced',
    xpReward: 150,
    brief: 'Add, subtract, multiply, divide — and survive being asked to divide by zero.',
    instructions: [
      'Write a function called calculate that takes two numbers and an operation.',
      'Handle +, -, * and / .',
      'Dividing by zero must not crash. Return a friendly message instead.',
      'Return the answer.',
    ],
    starterCode:
      'def calculate(a, b, operation):\n    # Your code here\n    pass\n\nprint(calculate(8, 2, "/"))\n',
    checks: [
      { label: 'Defines a function called calculate', pattern: /def\s+calculate\s*\(/ },
      { label: 'Handles adding and subtracting', pattern: /['"]\s*\+\s*['"]/ },
      { label: 'Handles multiplying and dividing', pattern: /['"]\s*[*/]\s*['"]/ },
      { label: 'Chooses what to do with if / elif', pattern: /\bif\b/ },
      {
        label: 'Copes with dividing by zero',
        pattern: /(==\s*0|!=\s*0|\bb\s*==\s*0|\btry\b|ZeroDivisionError)/,
      },
      { label: 'Gives an answer back with return', pattern: /\breturn\b/ },
    ],
    solution: `def calculate(a, b, operation):
    if operation == "+":
        return a + b
    if operation == "-":
        return a - b
    if operation == "*":
        return a * b
    if operation == "/":
        if b == 0:
            return "I can't divide by zero!"
        return a / b
    return "I don't know that operation."

print(calculate(8, 2, "/"))`,
  },
];
