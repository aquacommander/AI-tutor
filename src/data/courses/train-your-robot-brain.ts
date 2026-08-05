import type { Course } from '@/types/course';

/**
 * Train Your Robot Brain
 *
 * Generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx by
 * `scripts/curriculum/`. Content comes from that document; the quiz distractors
 * come from `scripts/curriculum/distractors.json` and are authored rather than
 * parsed. Video durations are read from the files themselves, never from the
 * plan — the two disagreed before.
 *
 * Do not hand-edit: re-run the generator instead.
 */
export const trainYourRobotBrain: Course = {
  "id": "train-your-robot-brain",
  "number": 2,
  "title": "Train Your Robot Brain",
  "tagline": "Choose good clues, clean the data, and discover how machine learning really works.",
  "outcomes": [
    "Choose features that are relevant, measurable and safe.",
    "Spot duplicates, missing labels and imbalance in a dataset.",
    "Explain why a machine can estimate tone but not know a feeling.",
    "Use a train-tune-test cycle to make a simple model better."
  ],
  "lessons": [
    {
      "id": "feature-find",
      "number": 1,
      "title": "Feature Find: Choose the Right Clues",
      "hook": "Show the same set of toys and ask learners to sort them first by storage size, then by cleaning method. Compare which clues changed.",
      "watchFocus": "The best feature depends on the goal. More information is not automatically better.",
      "video": {
        "src": "/videos/train-your-robot-brain/feature-find.mp4",
        "poster": "lesson-posters/feature-find.webp",
        "durationSeconds": 101
      },
      "concept": {
        "bigIdea": "A piece of information used to make a decision.",
        "vocabulary": [
          "feature",
          "goal",
          "relevant",
          "measurable",
          "safe",
          "sensitive information"
        ],
        "objectives": [
          "Define a feature as information used for a decision.",
          "Choose features that match a stated goal.",
          "Reject irrelevant or sensitive information."
        ]
      },
      "activity": {
        "title": "Three-Way Toy Sort",
        "steps": [
          "Sort toys by storage size using size and shape.",
          "Reset and sort for indoor versus outdoor play.",
          "Reset and sort by material for cleaning.",
          "Circle the most useful feature for each goal.",
          "Identify one feature that should never be used for an unrelated child decision."
        ]
      },
      "independentMission": "Give a goal and ask the learner to choose three useful features and one feature to exclude.",
      "childMission": "Pick a job — sorting socks, packing a lunchbox, choosing a film. Write down three clues that would really help, and one clue that should never be used.",
      "quiz": [
        {
          "question": "What is a feature?",
          "options": [
            "A piece of information used to make a decision.",
            "A special ability the computer has.",
            "The name of the finished category."
          ],
          "answer": "A piece of information used to make a decision.",
          "explanation": "Features are the clues a system measures."
        },
        {
          "question": "Is color useful for every toy-sorting goal?",
          "options": [
            "No. It depends on the goal.",
            "Yes — colour is always the clearest clue.",
            "No — colour is never useful."
          ],
          "answer": "No. It depends on the goal.",
          "explanation": "Relevance changes with the task."
        },
        {
          "question": "Why avoid unnecessary personal information?",
          "options": [
            "It can be irrelevant and create privacy or fairness risks.",
            "It makes the file bigger.",
            "It is fine to collect, as long as you do not look at it."
          ],
          "answer": "It can be irrelevant and create privacy or fairness risks.",
          "explanation": "Safe systems collect only what they need."
        },
        {
          "question": "What makes a feature measurable?",
          "options": [
            "It can be observed or recorded consistently.",
            "It sounds scientific.",
            "Everybody agrees it is important."
          ],
          "answer": "It can be observed or recorded consistently.",
          "explanation": "Vague features produce inconsistent decisions."
        },
        {
          "question": "Is using more features always better?",
          "options": [
            "No. Extra features can add noise or risk.",
            "Yes — more information is always better.",
            "Yes, as long as the computer is fast enough."
          ],
          "answer": "No. Extra features can add noise or risk.",
          "explanation": "Good selection is purposeful."
        }
      ],
      "adaptation": {
        "younger": "sort physical toys with picture goal cards.",
        "older": "discuss proxy variables and feature leakage."
      },
      "parentTakeaway": "The learner discovers that useful AI decisions begin with a clear goal and carefully chosen information.",
      "badgeId": "train-your-robot-brain-feature-find",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "data-kitchen",
      "number": 2,
      "title": "Data Kitchen: Better Ingredients, Better Results",
      "hook": "Present a pretend fruit recipe containing repeated, missing and impossible items. Ask what must be fixed before cooking.",
      "watchFocus": "Good data is not only “more data.” It must be accurate, labelled, varied and fit for the people or cases affected.",
      "video": {
        "src": "/videos/train-your-robot-brain/data-kitchen.mp4",
        "poster": "lesson-posters/data-kitchen.webp",
        "durationSeconds": 95
      },
      "concept": {
        "bigIdea": "The same example appearing more than once unintentionally.",
        "vocabulary": [
          "dataset",
          "duplicate",
          "missing value",
          "label",
          "balance",
          "representative"
        ],
        "objectives": [
          "Identify duplicates, missing labels and impossible values.",
          "Explain imbalance with a simple category example.",
          "Propose a specific data improvement."
        ]
      },
      "activity": {
        "title": "Clean the Recipe Data",
        "steps": [
          "Circle duplicates, missing labels and impossible values in a small dataset.",
          "Choose which rows to correct, remove or investigate.",
          "Count examples in each category.",
          "Add examples to reduce a clear imbalance.",
          "Write a one-sentence data note explaining the changes."
        ]
      },
      "independentMission": "Create one “bad data ingredient” and explain the error it might cause.",
      "childMission": "Invent one piece of bad data — a duplicate, a missing label, or something impossible. Then explain what mistake it would make the machine learn.",
      "quiz": [
        {
          "question": "What is a duplicate?",
          "options": [
            "The same example appearing more than once unintentionally.",
            "An example with a missing label.",
            "A copy you made on purpose as a backup."
          ],
          "answer": "The same example appearing more than once unintentionally.",
          "explanation": "Duplicates can distort patterns."
        },
        {
          "question": "Why are missing labels a problem?",
          "options": [
            "The system may not know the correct category.",
            "They make the table look untidy.",
            "They are not a problem — the computer guesses."
          ],
          "answer": "The system may not know the correct category.",
          "explanation": "Supervised learning needs reliable labels."
        },
        {
          "question": "What is imbalance?",
          "options": [
            "Some groups or categories have far more examples than others.",
            "When the data is stored in the wrong order.",
            "When two examples contradict each other."
          ],
          "answer": "Some groups or categories have far more examples than others.",
          "explanation": "Underrepresented cases may perform poorly."
        },
        {
          "question": "Does a larger dataset guarantee better results?",
          "options": [
            "No. Quality and representation also matter.",
            "Yes — more data always wins.",
            "No — smaller datasets are always better."
          ],
          "answer": "No. Quality and representation also matter.",
          "explanation": "Quantity cannot repair systematic errors."
        },
        {
          "question": "What should a data note record?",
          "options": [
            "What was changed and why.",
            "Only the final number of rows.",
            "Nothing — the data speaks for itself."
          ],
          "answer": "What was changed and why.",
          "explanation": "Documentation supports responsible review."
        }
      ],
      "adaptation": {
        "younger": "clean a picture-based fruit table.",
        "older": "discuss sampling bias, label noise and class imbalance metrics."
      },
      "parentTakeaway": "The learner sees that reliable AI begins with careful, representative and documented data.",
      "badgeId": "train-your-robot-brain-data-kitchen",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "mood-mixer",
      "number": 3,
      "title": "Mood Mixer: Words, Tone and Context",
      "hook": "Read “Great, another rainy day!” twice: once happily and once with frustration. Ask whether the words alone reveal the meaning.",
      "watchFocus": "A language system predicts from words and patterns; it cannot read a person’s mind.",
      "video": {
        "src": "/videos/train-your-robot-brain/mood-mixer.mp4",
        "poster": "lesson-posters/mood-mixer.webp",
        "durationSeconds": 59
      },
      "concept": {
        "bigIdea": "The likely tone of a message.",
        "vocabulary": [
          "sentiment",
          "tone",
          "context",
          "sarcasm",
          "positive",
          "negative",
          "unclear"
        ],
        "objectives": [
          "Explain sentiment classification as estimating tone from language.",
          "Recognize that context can change meaning.",
          "Use Unclear and a kind follow-up question instead of claiming to know a feeling."
        ]
      },
      "activity": {
        "title": "Message Meaning Match",
        "steps": [
          "Sort four clear message cards into Positive, Negative or Unclear.",
          "Add context cards to three ambiguous messages.",
          "Update the first prediction when context changes.",
          "Highlight the words that influenced the original choice.",
          "Write one kind follow-up question for an unclear message."
        ]
      },
      "independentMission": "Create a sentence that could sound positive or negative depending on context.",
      "childMission": "Write one sentence that could sound happy OR cross, depending on what happened before it. Try it on someone and see which way they read it.",
      "quiz": [
        {
          "question": "What does sentiment classification estimate?",
          "options": [
            "The likely tone of a message.",
            "Exactly how the writer feels inside.",
            "Whether the message is spelled correctly."
          ],
          "answer": "The likely tone of a message.",
          "explanation": "It predicts a category, not a private feeling."
        },
        {
          "question": "What can make “Great!” negative?",
          "options": [
            "Sarcasm or surrounding context.",
            "Using a capital letter.",
            "Nothing — “Great!” is always positive."
          ],
          "answer": "Sarcasm or surrounding context.",
          "explanation": "The same words can carry different meanings."
        },
        {
          "question": "Can AI know exactly how a person feels?",
          "options": [
            "No. It can only estimate from available signals.",
            "Yes, if the message is long enough.",
            "Yes — that is what sentiment analysis means."
          ],
          "answer": "No. It can only estimate from available signals.",
          "explanation": "Emotion prediction has limits."
        },
        {
          "question": "What is a safe response to an unclear message?",
          "options": [
            "Ask a kind clarifying question.",
            "Assume the worst and reply angrily.",
            "Pick the most likely feeling and act on it."
          ],
          "answer": "Ask a kind clarifying question.",
          "explanation": "Clarification is better than assumption."
        },
        {
          "question": "Why include an Unclear category?",
          "options": [
            "Some language is genuinely ambiguous.",
            "To make the quiz easier.",
            "Because the computer gets tired."
          ],
          "answer": "Some language is genuinely ambiguous.",
          "explanation": "Honest uncertainty reduces harm."
        }
      ],
      "adaptation": {
        "younger": "use emoji and voice-tone demonstrations.",
        "older": "discuss sentiment datasets, dialect and cultural context."
      },
      "parentTakeaway": "The learner understands that language tools estimate tone and should never be treated as mind readers.",
      "badgeId": "train-your-robot-brain-mood-mixer",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "robot-brain",
      "number": 4,
      "title": "Robot Brain: Train, Tune, Test",
      "hook": "Ask: “Would it be fair to practise with the exact questions from the final test?” Connect the answer to model evaluation.",
      "watchFocus": "The final test should measure performance honestly, not provide extra practice answers.",
      "video": {
        "src": "/videos/train-your-robot-brain/robot-brain.mp4",
        "poster": "lesson-posters/robot-brain.webp",
        "durationSeconds": 142
      },
      "concept": {
        "bigIdea": "The system learns or builds rules from labelled examples.",
        "vocabulary": [
          "train",
          "tune",
          "test",
          "validation",
          "final test",
          "generalize"
        ],
        "objectives": [
          "Describe the Train–Tune–Test cycle.",
          "Keep final test examples separate from improvement work.",
          "Make one targeted change and evaluate whether it generalizes."
        ]
      },
      "activity": {
        "title": "Robot Brain Championship",
        "steps": [
          "Use a small labelled training set to create an initial rule.",
          "Try a tuning set and record repeated errors.",
          "Change one feature, label or rule based on the evidence.",
          "Seal the final test cards until tuning is complete.",
          "Run the final test once and report both successes and remaining limits."
        ]
      },
      "independentMission": "Write a fair “model card” with the goal, test result, one strength and one limitation.",
      "childMission": "Write a short report card for your rule. Put the goal, how it did on the test, one thing it is good at, and one thing it still gets wrong. Be honest about the second one!",
      "quiz": [
        {
          "question": "What happens during training?",
          "options": [
            "The system learns or builds rules from labelled examples.",
            "The system is tested on examples it has never seen.",
            "A person types in every rule by hand."
          ],
          "answer": "The system learns or builds rules from labelled examples.",
          "explanation": "Training creates the initial model."
        },
        {
          "question": "What is tuning for?",
          "options": [
            "Improving choices using separate feedback examples.",
            "Making the model run faster.",
            "Adding extra categories at the end."
          ],
          "answer": "Improving choices using separate feedback examples.",
          "explanation": "Tuning refines without using the final test."
        },
        {
          "question": "Why seal the final test?",
          "options": [
            "To preserve an honest evaluation.",
            "To keep the examples secret from other people.",
            "To save space on the computer."
          ],
          "answer": "To preserve an honest evaluation.",
          "explanation": "Repeated peeking makes the score unreliable."
        },
        {
          "question": "What does generalize mean?",
          "options": [
            "Work well on new examples, not only familiar ones.",
            "Remember every training example perfectly.",
            "Work on one very specific task only."
          ],
          "answer": "Work well on new examples, not only familiar ones.",
          "explanation": "Real usefulness requires transfer."
        },
        {
          "question": "Should a final report hide errors?",
          "options": [
            "No. It should report strengths and limits.",
            "Yes — errors make the work look bad.",
            "Only if the errors are small."
          ],
          "answer": "No. It should report strengths and limits.",
          "explanation": "Transparent reporting supports safe use."
        }
      ],
      "adaptation": {
        "younger": "use three envelopes and picture cards.",
        "older": "separate training, validation and test metrics and discuss overfitting."
      },
      "parentTakeaway": "The learner completes a responsible train–tune–test cycle and reports limitations honestly.",
      "badgeId": "train-your-robot-brain-robot-brain",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    }
  ],
  "capstone": {
    "id": "robot-trainer-lab",
    "title": "Robot Trainer Lab",
    "time": "35–45 min",
    "badgeId": "robot-brain-champion",
    "summary": "Learners choose features, clean a small dataset, train a simple rule, test ambiguous cases and publish a one-page model card.",
    "evidence": "Worksheet, explanation and final design or decision",
    "tasks": [
      "Choose relevant, measurable and safe features for a goal.",
      "Clean a small dataset containing duplicates, missing labels and imbalance.",
      "Train and tune a simple classifier.",
      "Open a sealed test set and publish a short model card."
    ],
    "successStandard": "The learner must explain the reasoning behind the result, not only submit a final answer.",
    "xpReward": 150
  },
  "difficulty": "beginner",
  "topics": [
    "Machine Learning",
    "Data"
  ],
  "image": "courses/data-science.webp",
  "accent": "blue"
};
