import type { Course } from '@/types/course';

/**
 * Smart and Safe AI Heroes
 *
 * Generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx by
 * `scripts/curriculum/`. Content comes from that document; the quiz distractors
 * come from `scripts/curriculum/distractors.json` and are authored rather than
 * parsed. Video durations are read from the files themselves, never from the
 * plan — the two disagreed before.
 *
 * Do not hand-edit: re-run the generator instead.
 */
export const smartAndSafeAiHeroes: Course = {
  "id": "smart-and-safe-ai-heroes",
  "number": 4,
  "title": "Smart and Safe AI Heroes",
  "tagline": "Protect privacy, check what is true, and know when a human must decide.",
  "outcomes": [
    "Collect only the information a clear purpose needs.",
    "Check a claim by its source, date, evidence and context.",
    "Explain why popularity is not evidence.",
    "Say when a trusted adult or a human decision is required."
  ],
  "lessons": [
    {
      "id": "privacy-mission",
      "number": 1,
      "title": "Privacy Mission: Collect Only What Is Needed",
      "hook": "Ask: “A drawing app wants your home address. Does it need it to let you draw?” Require a reason.",
      "watchFocus": "Every requested data field should connect to a clear purpose. Less data can be safer and still achieve the goal.",
      "video": {
        "src": "/videos/smart-and-safe-ai-heroes/privacy-mission.mp4",
        "poster": "lesson-posters/privacy-mission.webp",
        "durationSeconds": 64
      },
      "concept": {
        "bigIdea": "Collecting only the information needed for a clear purpose.",
        "vocabulary": [
          "personal data",
          "privacy",
          "purpose",
          "minimum",
          "permission",
          "delete"
        ],
        "objectives": [
          "Distinguish necessary from unnecessary personal data.",
          "Apply data minimization to a child-facing app.",
          "Name a safe action before sharing information."
        ]
      },
      "activity": {
        "title": "App Privacy Makeover",
        "steps": [
          "Read the fictional app’s purpose.",
          "Sort requested fields into Needed, Optional and Do Not Collect.",
          "Replace exact information with a less specific option where possible.",
          "Add a child-friendly explanation and trusted-adult permission step.",
          "Choose when stored data should be deleted."
        ]
      },
      "independentMission": "Redesign one sign-up form so it asks for the minimum information needed.",
      "childMission": "Design a sign-up form for an app you would like. Write down only the boxes it truly needs — then cross out anything you could live without.",
      "quiz": [
        {
          "question": "What is data minimization?",
          "options": [
            "Collecting only the information needed for a clear purpose.",
            "Making the writing on a form smaller.",
            "Collecting as much as possible, in case it is useful later."
          ],
          "answer": "Collecting only the information needed for a clear purpose.",
          "explanation": "It reduces unnecessary exposure."
        },
        {
          "question": "Which is often safer: exact birth date or age band?",
          "options": [
            "Age band, when an exact date is not needed.",
            "Exact birth date — it is more accurate.",
            "They carry exactly the same risk."
          ],
          "answer": "Age band, when an exact date is not needed.",
          "explanation": "Less precise data can meet the same goal."
        },
        {
          "question": "Should an app explain why it wants data?",
          "options": [
            "Yes. The purpose should be clear.",
            "No — that would make the form too long.",
            "Only if the user asks first."
          ],
          "answer": "Yes. The purpose should be clear.",
          "explanation": "Informed choices require understandable reasons."
        },
        {
          "question": "Who should a child involve before sharing sensitive data?",
          "options": [
            "A trusted adult.",
            "Their best friend.",
            "Nobody — it is a private decision."
          ],
          "answer": "A trusted adult.",
          "explanation": "Adult support strengthens safety."
        },
        {
          "question": "Should data be kept forever by default?",
          "options": [
            "No. Delete it when the purpose is finished.",
            "Yes — you might need it one day.",
            "Yes, as long as it is kept safe."
          ],
          "answer": "No. Delete it when the purpose is finished.",
          "explanation": "Retention should be limited."
        }
      ],
      "adaptation": {
        "younger": "use simple safe/not-safe cards with an adult.",
        "older": "discuss consent, retention, access control and privacy by design."
      },
      "parentTakeaway": "The learner practises deciding what an app genuinely needs and when to involve a trusted adult.",
      "badgeId": "smart-and-safe-ai-heroes-privacy-mission",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "truth-tracker",
      "number": 2,
      "title": "Truth Tracker: Check Before You Share",
      "hook": "Show a dramatic fictional headline. Ask learners to pause, breathe and identify what information is missing before reacting.",
      "watchFocus": "Likes and confident language are not evidence. Verification happens before sharing.",
      "video": {
        "src": "/videos/smart-and-safe-ai-heroes/truth-tracker.mp4",
        "poster": "lesson-posters/truth-tracker.webp",
        "durationSeconds": 127
      },
      "concept": {
        "bigIdea": "Its source and what the source actually says.",
        "vocabulary": [
          "claim",
          "source",
          "evidence",
          "date",
          "context",
          "misinformation",
          "verify"
        ],
        "objectives": [
          "Apply a simple source–date–evidence–context checklist.",
          "Explain how real media can be paired with false context.",
          "Choose Do Not Share or Need More Information when evidence is insufficient."
        ]
      },
      "activity": {
        "title": "Newsroom Verification Desk",
        "steps": [
          "Read a fictional claim without reacting to the headline.",
          "Find the named source and publication date.",
          "Identify the evidence actually provided.",
          "Compare the claim with two tutor-supplied reliable sources.",
          "Choose Share, Do Not Share or Need More Information and explain the decision."
        ]
      },
      "independentMission": "Write a calm response to a friend who shared an unverified claim.",
      "childMission": "A friend shares something that might not be true. Write a kind message back. Do not tell them they are wrong — ask where it came from.",
      "quiz": [
        {
          "question": "What should you check first about a claim?",
          "options": [
            "Its source and what the source actually says.",
            "How many people have shared it.",
            "Whether it matches what you already believe."
          ],
          "answer": "Its source and what the source actually says.",
          "explanation": "A claim without a traceable source is weak."
        },
        {
          "question": "Why does the date matter?",
          "options": [
            "Old information may be presented as current.",
            "Older posts are always more trustworthy.",
            "It does not matter, if the facts are right."
          ],
          "answer": "Old information may be presented as current.",
          "explanation": "Context can change over time."
        },
        {
          "question": "Are many likes proof that a post is true?",
          "options": [
            "No. Popularity is not evidence.",
            "Yes — that many people cannot all be wrong.",
            "Yes, if the account has a verified tick."
          ],
          "answer": "No. Popularity is not evidence.",
          "explanation": "False claims can spread widely."
        },
        {
          "question": "Can a real photo support a false claim?",
          "options": [
            "Yes, if the context is changed.",
            "No — a real photo always tells the truth.",
            "Only if the photo has been edited."
          ],
          "answer": "Yes, if the context is changed.",
          "explanation": "Authentic media can be misused."
        },
        {
          "question": "What should you do when evidence is insufficient?",
          "options": [
            "Do not share, or mark Need More Information.",
            "Share it with a warning that it might be false.",
            "Share it — somebody else will check."
          ],
          "answer": "Do not share, or mark Need More Information.",
          "explanation": "Pausing prevents further spread."
        }
      ],
      "adaptation": {
        "younger": "use simple “Who said it? When? How do they know?” cards.",
        "older": "compare primary and secondary sources and reverse-context scenarios."
      },
      "parentTakeaway": "The learner develops a practical routine for checking online claims before believing or sharing them.",
      "badgeId": "smart-and-safe-ai-heroes-truth-tracker",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    }
  ],
  "capstone": {
    "id": "digital-safety-newsroom",
    "title": "Digital Safety Newsroom",
    "time": "35–45 min",
    "badgeId": "smart-and-safe-ai-hero",
    "summary": "Learners audit an app form, verify a viral claim and decide when a human or trusted adult must take control.",
    "evidence": "Worksheet, explanation and final design or decision",
    "tasks": [
      "Redesign an app form using data minimization.",
      "Verify a fictional viral post using source, date, evidence and context.",
      "Discuss three bonus cases: safe rescue route, fair team selection and when a human must take control.",
      "Create a personal “Pause Before You Share” checklist."
    ],
    "successStandard": "The learner must explain the reasoning behind the result, not only submit a final answer.",
    "xpReward": 150
  },
  "difficulty": "intermediate",
  "topics": [
    "Privacy",
    "Safety"
  ],
  "image": "courses/vision-nlp.webp",
  "accent": "green"
};
