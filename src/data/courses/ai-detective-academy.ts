import type { Course } from '@/types/course';

/**
 * AI Detective Academy
 *
 * Generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx by
 * `scripts/curriculum/`. Content comes from that document; the quiz distractors
 * come from `scripts/curriculum/distractors.json` and are authored rather than
 * parsed. Video durations are read from the files themselves, never from the
 * plan — the two disagreed before.
 *
 * Do not hand-edit: re-run the generator instead.
 */
export const aiDetectiveAcademy: Course = {
  "id": "ai-detective-academy",
  "number": 1,
  "title": "AI Detective Academy",
  "tagline": "Use clues to discover how AI sees, hears, compares and sometimes gets things wrong.",
  "outcomes": [
    "Explain that AI uses patterns and signals rather than human understanding.",
    "Compare human and machine strengths in simple perception tasks.",
    "Test an AI-like system and describe why mistakes happen.",
    "Use evidence and clear reasoning to support a conclusion."
  ],
  "lessons": [
    {
      "id": "picture-clue-patrol",
      "number": 1,
      "title": "Picture Clue Patrol: How Does AI See?",
      "hook": "Show one clear animal card and one cropped or shadowed version. Ask: “What clues stayed the same?” Do not define image classification yet.",
      "watchFocus": "Pause mentally whenever Pip makes a choice. Learners should look for the clue behind the choice, not only the answer.",
      "video": {
        "src": "/videos/ai-detective-academy/picture-clue-patrol.mp4",
        "poster": "lesson-posters/picture-clue-patrol.webp",
        "durationSeconds": 188
      },
      "concept": {
        "bigIdea": "It places a picture into a category.",
        "vocabulary": [
          "image",
          "feature",
          "label",
          "classification",
          "prediction",
          "unsure"
        ],
        "objectives": [
          "Define image classification in child-friendly language.",
          "Use at least two visible features to justify a category.",
          "Choose “Unsure” when evidence is incomplete and explain why."
        ]
      },
      "activity": {
        "title": "Mystery Picture Sort",
        "steps": [
          "Place Cat, Dog and Unsure category cards on a table or screen.",
          "Sort six clear animal cards and name one visible clue for each.",
          "Sort six tricky cards containing shadows, costumes, partial views or unusual angles.",
          "Move weak-evidence cases to Unsure rather than forcing a guess.",
          "Write one rule that would help Pip avoid a repeated mistake."
        ]
      },
      "independentMission": "Give the learner a new animal image. Require the sentence: “I chose ___ because I noticed ___ and ___.”",
      "childMission": "Find a picture of an animal — a book, a magazine, or one you draw yourself. Show it to someone and finish this out loud: “I chose ___ because I noticed ___ and ___.” Two clues, not one!",
      "quiz": [
        {
          "question": "What does image classification do?",
          "options": [
            "It places a picture into a category.",
            "It makes the picture bigger and clearer.",
            "It understands the picture the way you do."
          ],
          "answer": "It places a picture into a category.",
          "explanation": "This is the central concept of the lesson."
        },
        {
          "question": "Why might a cat wearing a costume confuse a classifier?",
          "options": [
            "The costume may create misleading visual features.",
            "The classifier thinks costumes are funny.",
            "A costume turns the animal into something else."
          ],
          "answer": "The costume may create misleading visual features.",
          "explanation": "AI can focus on the wrong pattern."
        },
        {
          "question": "When is “Unsure” the best answer?",
          "options": [
            "When the picture does not provide enough reliable evidence.",
            "When you want to finish quickly.",
            "Never — you should always pick an answer."
          ],
          "answer": "When the picture does not provide enough reliable evidence.",
          "explanation": "Responsible systems should not invent certainty."
        },
        {
          "question": "Is one feature always enough?",
          "options": [
            "No. Several relevant clues are often needed.",
            "Yes, if it is a really good clue.",
            "Yes, as long as the picture is clear."
          ],
          "answer": "No. Several relevant clues are often needed.",
          "explanation": "Single-feature rules are fragile."
        },
        {
          "question": "What should we do after an incorrect prediction?",
          "options": [
            "Check the clues, question the rule and improve it.",
            "Decide the AI is broken and stop using it.",
            "Ignore it — one mistake does not matter."
          ],
          "answer": "Check the clues, question the rule and improve it.",
          "explanation": "Errors are evidence for improvement."
        }
      ],
      "adaptation": {
        "younger": "use only picture cards and oral explanations.",
        "older": "compare a hand-written rule with a real classifier and discuss confidence scores."
      },
      "parentTakeaway": "The learner practises evidence-based sorting and learns that computer vision can be useful without being perfect.",
      "badgeId": "ai-detective-academy-picture-clue-patrol",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "sound-safari",
      "number": 2,
      "title": "Sound Safari: How Does AI Hear?",
      "hook": "Ask learners to close their eyes while the tutor makes a safe sound, such as tapping a pencil or shaking keys. Ask for two clues before revealing the source.",
      "watchFocus": "Listen for the difference between recognizing a pattern and understanding the real-world situation.",
      "video": {
        "src": "/videos/ai-detective-academy/sound-safari.mp4",
        "poster": "lesson-posters/sound-safari.webp",
        "durationSeconds": 111
      },
      "concept": {
        "bigIdea": "How high or low a sound is.",
        "vocabulary": [
          "sound wave",
          "pitch",
          "rhythm",
          "loudness",
          "noise",
          "speech recognition"
        ],
        "objectives": [
          "Name pitch, rhythm and loudness as useful sound features.",
          "Explain how background noise can change a prediction.",
          "Choose a safe confirmation response when speech is unclear."
        ]
      },
      "activity": {
        "title": "Eyes-Closed Sound Hunt",
        "steps": [
          "Play or make six safe sounds one at a time.",
          "For each sound, record the guessed source and two clues.",
          "Replay one sound with background noise added.",
          "Compare which features remained useful and which became unclear.",
          "Write a confirmation question a voice assistant should ask instead of guessing."
        ]
      },
      "independentMission": "Create a three-clue “sound riddle” for a partner without naming the source.",
      "childMission": "Make a sound riddle. Think of a sound, then give someone three clues about it — how high or low it is, its rhythm, how loud it is — without naming what makes it. Can they guess?",
      "quiz": [
        {
          "question": "What is pitch?",
          "options": [
            "How high or low a sound is.",
            "How loud or quiet a sound is.",
            "How long a sound lasts."
          ],
          "answer": "How high or low a sound is.",
          "explanation": "Pitch is one measurable audio feature."
        },
        {
          "question": "What can background noise do?",
          "options": [
            "Hide or distort useful sound patterns.",
            "Make the computer listen harder.",
            "Nothing — computers filter it out perfectly."
          ],
          "answer": "Hide or distort useful sound patterns.",
          "explanation": "Noise can lower reliability."
        },
        {
          "question": "Should a voice assistant act when it is unsure?",
          "options": [
            "It should ask for confirmation first.",
            "It should guess the most likely thing.",
            "It should act anyway — it is usually right."
          ],
          "answer": "It should ask for confirmation first.",
          "explanation": "Confirmation prevents harmful mistakes."
        },
        {
          "question": "Name another useful sound feature.",
          "options": [
            "Rhythm or loudness.",
            "The meaning of the words.",
            "How much the listener enjoys it."
          ],
          "answer": "Rhythm or loudness.",
          "explanation": "Multiple features improve comparison."
        },
        {
          "question": "Does a waveform mean the computer understands the sound like a person?",
          "options": [
            "No. It measures patterns in the signal.",
            "Yes — a waveform is how hearing works.",
            "Yes, once it has heard enough sounds."
          ],
          "answer": "No. It measures patterns in the signal.",
          "explanation": "Pattern recognition is not human understanding."
        }
      ],
      "adaptation": {
        "younger": "use live sound guessing and picture choices.",
        "older": "view simple waveforms and compare amplitude, frequency and noise."
      },
      "parentTakeaway": "The learner explores how machines recognize sounds and why uncertain voice systems should ask for confirmation.",
      "badgeId": "ai-detective-academy-sound-safari",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "creative-clues",
      "number": 3,
      "title": "Creative Clues: Human or Machine?",
      "hook": "Show an unfamiliar picture and ask learners to guess who or what made it. Then ask: “What evidence do we actually have?”",
      "watchFocus": "Notice how conclusions change when source, process or metadata evidence is added.",
      "video": {
        "src": "/videos/ai-detective-academy/creative-clues.mp4",
        "poster": "lesson-posters/creative-clues.webp",
        "durationSeconds": 119
      },
      "concept": {
        "bigIdea": "No. Style alone is weak evidence.",
        "vocabulary": [
          "source",
          "evidence",
          "metadata",
          "process",
          "confidence",
          "generated"
        ],
        "objectives": [
          "Distinguish weak style clues from stronger source evidence.",
          "Use Sure, Likely and Unsure honestly.",
          "Explain why accusing a creator without evidence can be harmful."
        ]
      },
      "activity": {
        "title": "Gallery Source Investigation",
        "steps": [
          "Inspect a teacher-prepared creation without source information.",
          "Record a first guess and confidence level.",
          "Reveal one style clue, then one process clue, then a source record.",
          "Allow learners to update their conclusion after each clue.",
          "Write a fair claim that separates evidence from guesswork."
        ]
      },
      "independentMission": "Rewrite “AI definitely made this” as a careful evidence-based statement.",
      "childMission": "Someone says “AI definitely made this!” Say it again, but carefully, like a detective. Start with “It might be, because…” and give a real reason.",
      "quiz": [
        {
          "question": "Is visual style proof that AI made something?",
          "options": [
            "No. Style alone is weak evidence.",
            "Yes — AI work always looks the same.",
            "Yes, if it looks too perfect."
          ],
          "answer": "No. Style alone is weak evidence.",
          "explanation": "Humans and tools can produce similar styles."
        },
        {
          "question": "Which evidence is stronger: “it looks strange” or a verified creation record?",
          "options": [
            "A verified creation record.",
            "“It looks strange” — your eyes do not lie.",
            "They are equally strong."
          ],
          "answer": "A verified creation record.",
          "explanation": "Source evidence is more reliable than appearance."
        },
        {
          "question": "What should you say when evidence is incomplete?",
          "options": [
            "Likely or Unsure, with a reason.",
            "Say you are certain, so people believe you.",
            "Say nothing at all."
          ],
          "answer": "Likely or Unsure, with a reason.",
          "explanation": "Confidence should match evidence."
        },
        {
          "question": "Why can a false accusation cause harm?",
          "options": [
            "It can unfairly damage a person’s work or reputation.",
            "It slows the computer down.",
            "It does not — you can say sorry afterwards."
          ],
          "answer": "It can unfairly damage a person’s work or reputation.",
          "explanation": "Responsible claims affect real people."
        },
        {
          "question": "Can your conclusion change after new evidence?",
          "options": [
            "Yes. Good investigators update their view.",
            "No — changing your mind means you were careless.",
            "Only if somebody tells you to."
          ],
          "answer": "Yes. Good investigators update their view.",
          "explanation": "Changing with evidence is a strength."
        }
      ],
      "adaptation": {
        "younger": "use “guess” and “know” cards.",
        "older": "discuss metadata limits, provenance and manipulated evidence."
      },
      "parentTakeaway": "The learner practises fair source evaluation and avoids claiming AI authorship from appearance alone.",
      "badgeId": "ai-detective-academy-creative-clues",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "glitch-hunt",
      "number": 4,
      "title": "Glitch Hunt: Why AI Makes Mistakes",
      "hook": "Show a deliberately wrong sorting result. Ask: “What are three different reasons this could have happened?”",
      "watchFocus": "Watch for the difference between changing everything and testing one specific fix.",
      "video": {
        "src": "/videos/ai-detective-academy/glitch-hunt.mp4",
        "poster": "lesson-posters/glitch-hunt.webp",
        "durationSeconds": 63
      },
      "concept": {
        "bigIdea": "Observe and describe the error clearly.",
        "vocabulary": [
          "error",
          "cause",
          "hypothesis",
          "test",
          "fix",
          "improve"
        ],
        "objectives": [
          "Use a calm error-analysis cycle.",
          "Match an error to a plausible cause.",
          "Test one change at a time using a new example."
        ]
      },
      "activity": {
        "title": "Glitch Case Files",
        "steps": [
          "Read one short case and circle the incorrect result.",
          "Choose the most likely cause: poor examples, unclear input or wrong rule.",
          "Select one fix only.",
          "Predict what should improve if the hypothesis is correct.",
          "Test with a fresh example and record whether the fix worked."
        ]
      },
      "independentMission": "Explain a technology mistake without saying “the computer is stupid.” Use evidence and a possible cause.",
      "childMission": "Think of a time a phone, tablet or game got something wrong. Explain what happened without saying the computer is stupid — say what the clue was and what might have caused it.",
      "quiz": [
        {
          "question": "What is the first step after finding an error?",
          "options": [
            "Observe and describe the error clearly.",
            "Change as many things as possible straight away.",
            "Hide it so nobody notices."
          ],
          "answer": "Observe and describe the error clearly.",
          "explanation": "A precise problem is easier to investigate."
        },
        {
          "question": "What is a hypothesis?",
          "options": [
            "A testable idea about the cause.",
            "A fact you already know is true.",
            "A guess you never check."
          ],
          "answer": "A testable idea about the cause.",
          "explanation": "It guides the next experiment."
        },
        {
          "question": "Why change one thing at a time?",
          "options": [
            "So we can tell which change caused the improvement.",
            "Because computers can only handle one change.",
            "To make the work take longer."
          ],
          "answer": "So we can tell which change caused the improvement.",
          "explanation": "Controlled testing produces useful evidence."
        },
        {
          "question": "Should the same examples be used for every test?",
          "options": [
            "Use fresh examples as well.",
            "Yes — the same examples make results easy to compare.",
            "Yes, as long as there are lots of them."
          ],
          "answer": "Use fresh examples as well.",
          "explanation": "New cases show whether the fix generalizes."
        },
        {
          "question": "What does an error provide?",
          "options": [
            "A clue about what may need improvement.",
            "Proof that AI never works.",
            "A reason to start again from nothing."
          ],
          "answer": "A clue about what may need improvement.",
          "explanation": "Mistakes are information, not just failure."
        }
      ],
      "adaptation": {
        "younger": "use picture-based cause/fix cards.",
        "older": "introduce validation data, confounding changes and error categories."
      },
      "parentTakeaway": "The learner uses a scientific routine to investigate mistakes instead of automatically trusting or rejecting technology.",
      "badgeId": "ai-detective-academy-glitch-hunt",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "ai-detective",
      "number": 5,
      "title": "AI Detective: Build and Test a Classifier",
      "hook": "Show three imaginary creatures. Let learners invent category names and identify one feature that separates them.",
      "watchFocus": "Notice that training examples teach the rule, while unseen test examples check whether the rule works beyond memorization.",
      "video": {
        "src": "/videos/ai-detective-academy/ai-detective.mp4",
        "poster": "lesson-posters/ai-detective.webp",
        "durationSeconds": 89
      },
      "concept": {
        "bigIdea": "To build or learn the classification rule.",
        "vocabulary": [
          "training data",
          "test data",
          "decision rule",
          "classifier",
          "unseen example"
        ],
        "objectives": [
          "Create useful labels and features for a classification task.",
          "Build a simple decision rule with an Unsure outcome.",
          "Test the rule on unseen examples and improve one weakness."
        ]
      },
      "activity": {
        "title": "Creature Classifier Lab",
        "steps": [
          "Place eight labelled creature cards in a Training envelope.",
          "List the features that best separate the creature types.",
          "Create a short decision tree, including Unsure.",
          "Open four unseen Test cards and classify them without changing labels mid-test.",
          "Record errors and improve one part of the decision tree."
        ]
      },
      "independentMission": "Design one tricky creature card that exposes a weakness in the current rule.",
      "childMission": "Invent one tricky creature that would break your rule. Draw it, then explain which part of the rule it breaks and how you would fix it.",
      "quiz": [
        {
          "question": "What is training data used for?",
          "options": [
            "To build or learn the classification rule.",
            "To check how good the finished rule is.",
            "To store the answers so they can be looked up."
          ],
          "answer": "To build or learn the classification rule.",
          "explanation": "Training examples shape the classifier."
        },
        {
          "question": "What is test data used for?",
          "options": [
            "To check the rule on new examples.",
            "To teach the rule in the first place.",
            "To make the training set bigger."
          ],
          "answer": "To check the rule on new examples.",
          "explanation": "Testing measures generalization."
        },
        {
          "question": "Why keep test cards unseen?",
          "options": [
            "To prevent memorizing the answers.",
            "To keep them clean and undamaged.",
            "Because there are not enough to share."
          ],
          "answer": "To prevent memorizing the answers.",
          "explanation": "A fair test must be independent."
        },
        {
          "question": "Why include an Unsure outcome?",
          "options": [
            "Some cases do not contain enough clear evidence.",
            "To let the system avoid hard work.",
            "Because every question needs three answers."
          ],
          "answer": "Some cases do not contain enough clear evidence.",
          "explanation": "Uncertainty is safer than forced guessing."
        },
        {
          "question": "What should be improved after a repeated error?",
          "options": [
            "The relevant feature, example or decision rule.",
            "The screen the results appear on.",
            "Nothing — repeated errors are normal."
          ],
          "answer": "The relevant feature, example or decision rule.",
          "explanation": "Targeted improvement is more reliable."
        }
      ],
      "adaptation": {
        "younger": "use two creature categories and a simple yes/no rule.",
        "older": "calculate a confusion matrix and discuss overfitting."
      },
      "parentTakeaway": "The learner completes a miniature AI workflow: define, train, test and improve.",
      "badgeId": "ai-detective-academy-ai-detective",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    }
  ],
  "capstone": {
    "id": "mystery-media-lab",
    "title": "Mystery Media Lab",
    "time": "30–40 min",
    "badgeId": "chief-ai-detective",
    "summary": "Learners investigate one image, one sound and one creative work; classify with evidence, state confidence, diagnose one glitch and improve a rule.",
    "evidence": "Worksheet, explanation and final design or decision",
    "tasks": [
      "Classify one tricky image and one noisy sound using evidence.",
      "Evaluate the source of one creative work using confidence language.",
      "Diagnose one incorrect AI result and test a targeted fix.",
      "Build a simple decision rule and explain one limitation."
    ],
    "successStandard": "The learner must explain the reasoning behind the result, not only submit a final answer.",
    "xpReward": 150
  },
  "difficulty": "beginner",
  "topics": [
    "Perception",
    "Evidence"
  ],
  "image": "courses/ai-ethics.webp",
  "accent": "purple"
};
