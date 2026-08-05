import type { ActivityGame, RoundOption } from '@/types/activity';

/** Course 4 — Smart and Safe AI Heroes. */

const FIELD_OPTIONS: RoundOption[] = [
  { id: 'needed', label: 'Needed', emoji: '✅' },
  { id: 'optional', label: 'Optional', emoji: '🤔' },
  { id: 'never', label: 'Do not collect', emoji: '🚫' },
];

const appPrivacyMakeover: ActivityGame = {
  lessonKey: 'smart-and-safe-ai-heroes/privacy-mission',
  title: 'App Privacy Makeover',
  intro:
    'The Star Reader app wants to recommend books you might like. That is its whole purpose. Decide what it actually needs.',
  outro:
    'Data minimization means asking one question of every box on a form: does the purpose really need this? Most of the time, it does not.',
  rounds: [
    {
      id: 'books',
      visual: { kind: 'quote', text: 'Which books have you enjoyed?', label: 'A question about books read' },
      question: 'The app recommends books. Does it need this?',
      options: FIELD_OPTIONS,
      answer: 'needed',
      explanation: 'This is the whole point of the app. Without it there is nothing to recommend from.',
    },
    {
      id: 'address',
      visual: { kind: 'quote', text: 'What is your home address?', label: 'A question asking for a home address' },
      question: 'And your home address?',
      options: FIELD_OPTIONS,
      answer: 'never',
      clue: 'Does recommending a book need to know where you sleep?',
      explanation:
        'Recommending books needs nothing about where you live. It is private, it is risky, and the purpose does not need it.',
    },
    {
      id: 'birthday',
      visual: { kind: 'quote', text: 'What is your exact date of birth?', label: 'A question asking for an exact birth date' },
      question: 'The app wants your exact birthday to suggest age-suitable books.',
      options: [
        { id: 'band', label: 'Ask for an age band instead', emoji: '📊' },
        { id: 'exact', label: 'Exact date — it is more accurate', emoji: '📅' },
        { id: 'none', label: 'Ask nothing about age at all', emoji: '🚫' },
      ],
      answer: 'band',
      explanation:
        '"9–12" does the job just as well as a date, and an exact birthday is a valuable thing to hand over.',
    },
    {
      id: 'why',
      visual: { kind: 'emoji', emoji: '❓', label: 'A question mark' },
      question: 'The app asks for something. What should it always tell you?',
      options: [
        { id: 'why', label: 'Why it needs it, in words you understand', emoji: '💬' },
        { id: 'nothing', label: 'Nothing — that would make the form long', emoji: '📄' },
        { id: 'later', label: 'Only if you ask first', emoji: '🙋' },
      ],
      answer: 'why',
      explanation:
        'If an app cannot explain why it needs something, that is your answer about whether to give it.',
    },
    {
      id: 'delete',
      visual: { kind: 'emoji', emoji: '🗑️', label: 'A bin' },
      question: 'You stop using the app. What should happen to your data?',
      options: [
        { id: 'delete', label: 'Deleted — the purpose is finished', emoji: '🗑️' },
        { id: 'keep', label: 'Kept forever, in case you come back', emoji: '♾️' },
        { id: 'sold', label: 'Passed on to somebody else', emoji: '📤' },
      ],
      answer: 'delete',
      explanation:
        'Data that no longer has a purpose is just risk sitting on a computer. When the reason ends, so should the storing.',
    },
  ],
};

const SHARE_OPTIONS: RoundOption[] = [
  { id: 'share', label: 'Share it', emoji: '📤' },
  { id: 'dont', label: 'Do not share', emoji: '🚫' },
  { id: 'more', label: 'Need more information', emoji: '🔎' },
];

const newsroomVerificationDesk: ActivityGame = {
  lessonKey: 'smart-and-safe-ai-heroes/truth-tracker',
  title: 'Newsroom Verification Desk',
  intro:
    'Four posts have landed on the newsroom desk. Check each one before it goes any further.',
  outro:
    'Source, date, evidence, context. Four checks — and "I need more information" is a proper answer, not a failure.',
  rounds: [
    {
      id: 'likes',
      visual: {
        kind: 'quote',
        text: '“Scientists say chocolate cures colds!” — 2 million likes',
        label: 'A popular post with no named source',
      },
      question: 'Two million people shared it. Is it true?',
      options: SHARE_OPTIONS,
      answer: 'dont',
      clue: 'Which scientists? Said where?',
      explanation:
        '"Scientists say" names nobody. Popularity is not evidence — a false thing shared two million times is still false.',
    },
    {
      id: 'old',
      visual: {
        kind: 'quote',
        text: '“Flooding closes the city bridge” — posted today, article dated 2019',
        label: 'A recent post linking to a 2019 article',
      },
      question: 'The post is from today. The article is from 2019.',
      options: SHARE_OPTIONS,
      answer: 'dont',
      explanation:
        'A real event, presented as if it were happening now. Old news re-shared as current is one of the commonest tricks.',
    },
    {
      id: 'photo',
      visual: { kind: 'pair', left: '📷', right: '🌍', label: 'A real photo used with a wrong caption' },
      question: 'A genuine, unedited photo — but the caption says it is from a different country.',
      options: SHARE_OPTIONS,
      answer: 'dont',
      clue: 'The photo is real. Is the *claim* real?',
      explanation:
        'The photo has not been faked; the context has. A true picture can still tell a lie about where and when.',
    },
    {
      id: 'partial',
      visual: {
        kind: 'quote',
        text: '“Local park to close” — one named council source, no date',
        label: 'A post with a source but no date',
      },
      question: 'Named source, but no date and no second source.',
      options: SHARE_OPTIONS,
      answer: 'more',
      explanation:
        'Better than the others — but still incomplete. "Need more information" is the honest answer, not a cop-out.',
    },
    {
      id: 'verified',
      visual: {
        kind: 'quote',
        text: '“Library opens Saturday” — council website, dated this week, confirmed by the local paper',
        label: 'A claim with a source, a date and a second source',
      },
      question: 'Named source, dated this week, and a second source agrees.',
      options: SHARE_OPTIONS,
      answer: 'share',
      explanation:
        'Source, date, evidence and a second check all line up. This is what "verified enough to pass on" looks like.',
    },
  ],
};

export const course4Activities: ActivityGame[] = [appPrivacyMakeover, newsroomVerificationDesk];
