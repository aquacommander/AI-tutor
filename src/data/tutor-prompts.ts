import type { AgeGroupId } from '@/types/learner';

/**
 * Starter chips shown before the first message.
 *
 * A blank chat box is the hardest thing to put in front of a six-year-old, so
 * each group gets four questions it can actually read, pitched at the same
 * level as the answers it will get back.
 */
export const SUGGESTED_PROMPTS: Record<AgeGroupId, string[]> = {
  explorer: [
    'What is AI?',
    'How does a robot see?',
    'Can computers make up stories?',
    'Why do computers use 1s and 0s?',
  ],
  builder: [
    'How do I start with Python?',
    'What is training data?',
    'Help me make a number guessing game',
    'Why does AI sometimes get things wrong?',
  ],
  creator: [
    'How does a neural network actually learn?',
    "What's the difference between AI and machine learning?",
    'How would I build a simple image classifier?',
    'What are the big ethical problems with AI?',
  ],
};
