import type { Course } from '@/types/course';

/**
 * AI Game Creator Lab
 *
 * Generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx by
 * `scripts/curriculum/`. Content comes from that document; the quiz distractors
 * come from `scripts/curriculum/distractors.json` and are authored rather than
 * parsed. Video durations are read from the files themselves, never from the
 * plan — the two disagreed before.
 *
 * Do not hand-edit: re-run the generator instead.
 */
export const aiGameCreatorLab: Course = {
  "id": "ai-game-creator-lab",
  "number": 3,
  "title": "AI Game Creator Lab",
  "tagline": "Design characters, choices and mazes while learning how intelligent games are built.",
  "outcomes": [
    "Break a game into inputs, states and actions.",
    "Write if-then rules and give them a sensible priority.",
    "Plan and test a route, and explain what makes one route cost more.",
    "Build and improve a small game blueprint."
  ],
  "lessons": [
    {
      "id": "game-hero",
      "number": 1,
      "title": "Game Hero: Inputs, States and Actions",
      "hook": "Ask learners what should happen when the same jump button is pressed on the ground versus in mid-air.",
      "watchFocus": "The game character follows designed rules. It may appear clever without being alive or conscious.",
      "video": {
        "src": "/videos/ai-game-creator-lab/game-hero.mp4",
        "poster": "lesson-posters/game-hero.webp",
        "durationSeconds": 88
      },
      "concept": {
        "bigIdea": "A signal or event the game receives.",
        "vocabulary": [
          "input",
          "state",
          "action",
          "behavior",
          "feedback",
          "rule"
        ],
        "objectives": [
          "Identify an input, a remembered state and an action.",
          "Create different actions from the same input in different states.",
          "Test whether a character rule is clear and predictable."
        ]
      },
      "activity": {
        "title": "Hero Behavior Builder",
        "steps": [
          "Choose a hero goal and three things the hero can notice.",
          "Define two pieces of state the game remembers.",
          "Write three Input–State–Action rules.",
          "Act them out with a partner acting as the game engine.",
          "Revise any rule that produces confusing behavior."
        ]
      },
      "independentMission": "Create one rule that prevents an unsafe or unfair action in the game.",
      "childMission": "Write one rule that keeps your hero safe or keeps the game fair. Start it with IF, and make sure it beats every other rule.",
      "quiz": [
        {
          "question": "What is an input?",
          "options": [
            "A signal or event the game receives.",
            "The picture the game draws on screen.",
            "The hero’s personality."
          ],
          "answer": "A signal or event the game receives.",
          "explanation": "Inputs trigger decision rules."
        },
        {
          "question": "What is state?",
          "options": [
            "Information the game remembers about the current situation.",
            "How fast the game is running.",
            "The button the player pressed a moment ago."
          ],
          "answer": "Information the game remembers about the current situation.",
          "explanation": "State changes how the same input is handled."
        },
        {
          "question": "Can the same input cause different actions?",
          "options": [
            "Yes, when the state is different.",
            "No — one button always does one thing.",
            "Only if the game is broken."
          ],
          "answer": "Yes, when the state is different.",
          "explanation": "Responsive behavior depends on context."
        },
        {
          "question": "Is a game hero alive because it reacts?",
          "options": [
            "No. It follows programmed or learned behavior.",
            "Yes — reacting means it is thinking.",
            "Yes, once the game is complicated enough."
          ],
          "answer": "No. It follows programmed or learned behavior.",
          "explanation": "Appearance of agency is not consciousness."
        },
        {
          "question": "Why test rules with a partner?",
          "options": [
            "To find unclear or unexpected behavior.",
            "To prove your rules are already perfect.",
            "Because testing alone is against the rules."
          ],
          "answer": "To find unclear or unexpected behavior.",
          "explanation": "Testing improves design."
        }
      ],
      "adaptation": {
        "younger": "act out rules physically.",
        "older": "implement a finite-state machine or block-code prototype."
      },
      "parentTakeaway": "The learner understands the architecture behind responsive game characters.",
      "badgeId": "ai-game-creator-lab-game-hero",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "choice-engine",
      "number": 2,
      "title": "Choice Engine: If–Then Decisions",
      "hook": "Give the rule “If the door is locked, use the key.” Then add “If there is a fire, leave immediately.” Ask which rule should have priority.",
      "watchFocus": "A decision engine needs both conditions and an order for resolving conflicts.",
      "video": {
        "src": "/videos/ai-game-creator-lab/choice-engine.mp4",
        "poster": "lesson-posters/choice-engine.webp",
        "durationSeconds": 71
      },
      "concept": {
        "bigIdea": "A condition to check.",
        "vocabulary": [
          "condition",
          "if–then",
          "branch",
          "priority",
          "conflict",
          "feedback"
        ],
        "objectives": [
          "Write clear if–then rules.",
          "Order rules by priority when several conditions are true.",
          "Identify and repair a conflict between rules."
        ]
      },
      "activity": {
        "title": "Guard Rule Workshop",
        "steps": [
          "Choose four facts a castle guard can observe.",
          "Write three if–then rules.",
          "Place the rules in priority order.",
          "Role-play five player situations, including one conflict.",
          "Repair the conflict and add clear feedback for the player."
        ]
      },
      "independentMission": "Design a rule that asks permission before using a player’s personal information.",
      "childMission": "Write a rule where the game asks permission before using something private about the player. What exactly should it say?",
      "quiz": [
        {
          "question": "What comes after “if” in a rule?",
          "options": [
            "A condition to check.",
            "The action to carry out.",
            "The name of the character."
          ],
          "answer": "A condition to check.",
          "explanation": "The condition determines whether the rule applies."
        },
        {
          "question": "What comes after “then”?",
          "options": [
            "The action to perform.",
            "Another condition to check.",
            "The reason the rule exists."
          ],
          "answer": "The action to perform.",
          "explanation": "The action is the response."
        },
        {
          "question": "Why do rules need priority?",
          "options": [
            "More than one condition may be true.",
            "To make the list look tidy.",
            "Because the computer reads from the bottom upwards."
          ],
          "answer": "More than one condition may be true.",
          "explanation": "Priority resolves competing actions."
        },
        {
          "question": "What is a conflict?",
          "options": [
            "Two rules call for incompatible actions.",
            "A rule with a spelling mistake.",
            "A rule nobody has tested yet."
          ],
          "answer": "Two rules call for incompatible actions.",
          "explanation": "Conflicts can create unfair or broken behavior."
        },
        {
          "question": "Why provide feedback?",
          "options": [
            "So the player understands what happened and why.",
            "To make the game last longer.",
            "So the game can hide its mistakes."
          ],
          "answer": "So the player understands what happened and why.",
          "explanation": "Transparent systems are easier to trust and improve."
        }
      ],
      "adaptation": {
        "younger": "use physical condition/action cards.",
        "older": "create a flowchart and test edge cases."
      },
      "parentTakeaway": "The learner practises conditional logic, rule ordering and clear feedback.",
      "badgeId": "ai-game-creator-lab-choice-engine",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    },
    {
      "id": "maze-mission",
      "number": 3,
      "title": "Maze Mission: Goals, Paths and Costs",
      "hook": "Show two routes: one shorter but risky, one longer but safe. Ask which is best before revealing the mission goal.",
      "watchFocus": "Pathfinding is not only about distance; goals can include safety, time, energy or uncertainty.",
      "video": {
        "src": "/videos/ai-game-creator-lab/maze-mission.mp4",
        "poster": "lesson-posters/maze-mission.webp",
        "durationSeconds": 111
      },
      "concept": {
        "bigIdea": "A sequence of moves from start to goal.",
        "vocabulary": [
          "path",
          "goal",
          "cost",
          "visited",
          "obstacle",
          "uncertainty"
        ],
        "objectives": [
          "Compare routes using a stated cost.",
          "Track visited locations and obstacles.",
          "Explain why the “best” route depends on the goal."
        ]
      },
      "activity": {
        "title": "Crystal Route Race",
        "steps": [
          "Read the movement and cost rules.",
          "Mark the start, goal and known obstacles.",
          "Explore one route while recording visited squares.",
          "Calculate its total cost.",
          "Find a second route and compare distance, safety and uncertainty."
        ]
      },
      "independentMission": "Change one obstacle and explain how the best route should update.",
      "childMission": "Draw your maze, then move one wall. Explain out loud how the best route changes — and whether it is now longer, riskier, or both.",
      "quiz": [
        {
          "question": "What is a path?",
          "options": [
            "A sequence of moves from start to goal.",
            "The shortest straight line to the goal.",
            "A wall that blocks the way."
          ],
          "answer": "A sequence of moves from start to goal.",
          "explanation": "Paths are the object being compared."
        },
        {
          "question": "Why mark visited squares?",
          "options": [
            "To avoid unnecessary repetition and track exploration.",
            "To make the maze look colourful.",
            "To stop the player ever going back."
          ],
          "answer": "To avoid unnecessary repetition and track exploration.",
          "explanation": "Memory improves search efficiency."
        },
        {
          "question": "Is the shortest route always best?",
          "options": [
            "No. The goal may include safety or another cost.",
            "Yes — shortest always means best.",
            "No — the longest route is always safest."
          ],
          "answer": "No. The goal may include safety or another cost.",
          "explanation": "Optimization depends on the objective."
        },
        {
          "question": "What should happen when a new obstacle appears?",
          "options": [
            "Re-plan using the updated information.",
            "Keep following the old plan anyway.",
            "Stop and give up on the goal."
          ],
          "answer": "Re-plan using the updated information.",
          "explanation": "Adaptive systems respond to change."
        },
        {
          "question": "What does cost mean in pathfinding?",
          "options": [
            "A value used to compare routes, such as time or risk.",
            "How much money the game costs.",
            "The number of squares on the whole map."
          ],
          "answer": "A value used to compare routes, such as time or risk.",
          "explanation": "Cost makes the goal measurable."
        }
      ],
      "adaptation": {
        "younger": "walk a floor maze.",
        "older": "compare breadth-first search, weighted costs and heuristic ideas."
      },
      "parentTakeaway": "The learner sees that intelligent route planning depends on goals, costs and changing information.",
      "badgeId": "ai-game-creator-lab-maze-mission",
      "xpReward": 60,
      "learnerTime": "30–38 minutes"
    }
  ],
  "capstone": {
    "id": "mini-adventure-blueprint",
    "title": "Mini Adventure Blueprint",
    "time": "40–50 min",
    "badgeId": "junior-game-architect",
    "summary": "Learners design a hero, write prioritized if–then rules and create a maze with at least two routes and a measurable cost.",
    "evidence": "Worksheet, explanation and final design or decision",
    "tasks": [
      "Design a game hero with inputs, states and actions.",
      "Write prioritized if–then rules, including one safety rule.",
      "Create a maze with two routes and a measurable cost.",
      "Present the complete game blueprint and test one edge case."
    ],
    "successStandard": "The learner must explain the reasoning behind the result, not only submit a final answer.",
    "xpReward": 150
  },
  "difficulty": "intermediate",
  "topics": [
    "Games",
    "Logic"
  ],
  "image": "courses/game-robotics.webp",
  "accent": "orange"
};
