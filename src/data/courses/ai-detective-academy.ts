import type { Course } from '@/types/course';

/**
 * Course 1 — AI Detective Academy.
 *
 * Transcribed from AI_for_Kids_Complete_Course_Material.docx. Every field comes
 * from that document; nothing here is invented. `scripts/check-curriculum.mjs`
 * asserts the parts that must hold — five lessons, five quiz questions each,
 * and every correct answer present in its own options list.
 *
 * `visual` and `productionAssets` are film-crew direction rather than learner
 * content. They live here so the video production and the platform read from
 * one source instead of drifting apart.
 */
export const aiDetectiveAcademy: Course = {
  "id": "ai-detective-academy",
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
      "mission": "Help Pip sort mystery pictures using visible clues.",
      "concept": "image classification",
      "badgeId": "pixel-detective",
      "learnerTime": "30–45 minutes",
      "xpReward": 60,
      "objectives": [
        "Define image classification using a simple example.",
        "Identify at least two visual features used for sorting.",
        "Explain why an unusual image may be misclassified."
      ],
      "vocabulary": [
        "image",
        "feature",
        "label",
        "classification",
        "prediction"
      ],
      "materials": [
        "12 printed or on-screen animal cards",
        "Three category signs: Cat, Dog, Unsure",
        "Pencil and mission sheet"
      ],
      "components": [
        {
          "name": "Lesson video",
          "time": "10 min",
          "purpose": "Story, concept explanation and guided pauses"
        },
        {
          "name": "Mystery Picture Sort",
          "time": "10–12 min",
          "purpose": "Hands-on or interactive practice"
        },
        {
          "name": "Independent mission",
          "time": "8–12 min",
          "purpose": "Apply the concept without step-by-step help"
        },
        {
          "name": "Quiz and reflection",
          "time": "5 min",
          "purpose": "Check understanding and explain one key idea"
        }
      ],
      "scenes": [
        {
          "id": "cold-open",
          "label": "Cold open",
          "time": "0:00–0:50",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Can a robot see a cat if the picture is upside down, tiny, or partly hidden? Meet Pip, our curious robot, and Glitch, a tiny bug who loves making silly mistakes. Today your mission is help Pip sort mystery pictures using visible clues. Watch carefully, because the first clue appears before the countdown reaches zero. Ready? Three, two, one — mission start!"
            }
          ],
          "visual": "Fast animated opening. Show a normal cat picture changing into a shadow, zoomed crop and upside-down version. Display mission badge: Pixel Detective.",
          "isPause": false
        },
        {
          "id": "mission-briefing",
          "label": "Mission briefing",
          "time": "0:50–1:45",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Here is the problem. A delivery drone has mixed photographs of cats, dogs and toy animals. It must place each image in the correct folder before the pet shelter opens. Pip cannot solve it alone, because AI needs clear information and careful testing. Your job is not only to find an answer. Your job is to explain how you know. That is what real AI detectives and creators do."
            }
          ],
          "visual": "Introduce the story setting: the colorful Pixel Pet Shelter. Show Pip looking puzzled and a simple mission map.",
          "isPause": false
        },
        {
          "id": "try-before-telling",
          "label": "Try before telling",
          "time": "1:45–3:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Before I explain anything, try this. Look at three shadow pictures. Which one is most likely a cat, and which clue helped you decide? Pause the video for thirty seconds. Make your choice, point to it, or write it down. Welcome back. Did you notice that you used clues rather than magic? You looked for patterns, compared possibilities, and made a decision."
            }
          ],
          "visual": "Show the learner prompt with a 30-second countdown. Use large icons and very little text. Show three animal silhouettes with ears, tail and body-shape clues.",
          "isPause": true
        },
        {
          "id": "the-big-ai-idea",
          "label": "The big AI idea",
          "time": "3:00–4:35",
          "turns": [
            {
              "speaker": "tutor",
              "text": "The big idea today is image classification. Image classification means choosing a category for a picture. A computer measures patterns such as shapes, edges, colors and textures, then compares them with patterns learned from examples. AI does not understand the world exactly as a person does. It follows patterns found in examples, rules, or signals. That can be useful, but it also means we must check its work."
            }
          ],
          "visual": "Animate the concept using three simple steps: picture enters, features are noticed, category is predicted. Highlight the key word image classification.",
          "isPause": false
        },
        {
          "id": "worked-example",
          "label": "Worked example",
          "time": "4:35–6:05",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Let us solve one together. We compare a real cat, a toy cat and a fox. Pointed ears alone are not enough. We also inspect the face shape, paws, tail and texture. The toy cat may look cat-like, but the label depends on the mission: are we sorting by appearance or by what the object truly is? First, we collect the clues. Next, we compare them. Then, we make a choice and test it. If the answer is wrong, we do not say, ‘The robot is bad.’ We ask, ‘Which clue, example, or rule needs improving?’"
            }
          ],
          "visual": "Step-by-step demonstration with check marks. Circle ears, paws, tail and fur; then switch the sorting question to show why labels matter.",
          "isPause": false
        },
        {
          "id": "your-turn",
          "label": "Your turn",
          "time": "6:05–7:30",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Now it is your turn. Choose which folder receives a blurry rabbit picture: rabbit, cat or unsure. Use at least two clues. Pause for up to one minute. When you return, say your answer aloud using this sentence: ‘I chose ___ because ___.’ Welcome back. A strong answer includes both the choice and the reason."
            }
          ],
          "visual": "Display three choices and a one-minute pause screen. Folders labelled Rabbit, Cat and Need More Information.",
          "isPause": true
        },
        {
          "id": "glitch-alert",
          "label": "Glitch alert",
          "time": "7:30–8:55",
          "turns": [
            {
              "speaker": "glitch",
              "text": "I know! The AI answer must always be correct!"
            },
            {
              "speaker": "tutor",
              "text": "Glitch, that is today’s trap. AI is not looking with a mind or understanding the animal. It is matching numerical patterns, and unusual lighting or angles can confuse it. We should be curious, not afraid, when an AI makes a mistake. A mistake is a clue that helps us improve the data, the rule, or the way a person uses the tool."
            }
          ],
          "visual": "Glitch confidently gives a wrong answer; freeze-frame with a playful buzzer. Show ‘Check, Question, Improve.’",
          "isPause": false
        },
        {
          "id": "recap-and-badge",
          "label": "Recap and badge",
          "time": "8:55–10:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Mission complete. Today you learned three things. One: images can be sorted by learned patterns. Two: the label must match the question we are asking. Three: unusual pictures can cause mistakes. Your next task is the Mystery Picture Sort. Complete it to earn the Pixel Detective badge. Before you go, tell someone at home: ‘Today I discovered that AI ___.’ See you on the next mission!"
            }
          ],
          "visual": "Recap cards, badge animation, and preview of the activity. End with the course progress map moving forward one step.",
          "isPause": false
        }
      ],
      "activity": {
        "title": "Mystery Picture Sort",
        "purpose": "Practise image classification through a concrete, child-led task.",
        "time": "10–12 min",
        "steps": [
          "Place the Cat, Dog and Unsure signs on a table.",
          "Sort the first six clear pictures and say one clue for each choice.",
          "Sort six tricky pictures with shadows, costumes or partial views.",
          "Move any uncertain picture to Unsure instead of guessing.",
          "Compare choices and write one rule that would help Pip."
        ]
      },
      "independentMission": "Create one “tricky” animal picture by cropping or covering part of it. Ask another learner to classify it, then reveal which clue was missing.",
      "quiz": [
        {
          "question": "What does image classification do?",
          "options": [
            "Makes a picture louder",
            "Chooses a category for a picture",
            "Turns every picture into a cartoon"
          ],
          "answer": "Chooses a category for a picture",
          "explanation": "Classification assigns a label or category."
        },
        {
          "question": "Which is a visual feature?",
          "options": [
            "The shape of an ear",
            "The animal’s birthday",
            "The name of the folder owner"
          ],
          "answer": "The shape of an ear",
          "explanation": "Visible shapes, colors and textures can be used as features."
        },
        {
          "question": "Why might AI mistake a fox for a cat?",
          "options": [
            "They may share visible patterns",
            "AI is trying to be funny",
            "Foxes are secretly cats"
          ],
          "answer": "They may share visible patterns",
          "explanation": "Similar ears, fur and face shapes can confuse a pattern matcher."
        },
        {
          "question": "What should we do when the picture is too unclear?",
          "options": [
            "Guess quickly",
            "Use an Unsure option or ask for more information",
            "Delete every category"
          ],
          "answer": "Use an Unsure option or ask for more information",
          "explanation": "Responsible systems can admit uncertainty."
        },
        {
          "question": "Does AI understand a cat exactly like a child does?",
          "options": [
            "Yes, always",
            "No, it mainly matches patterns",
            "Only on Tuesdays"
          ],
          "answer": "No, it mainly matches patterns",
          "explanation": "The system processes patterns rather than human meaning."
        }
      ],
      "differentiation": {
        "explorer": "Use six large picture cards and only two categories plus Unsure. Let children point and speak rather than write.",
        "builder": "Use all 12 cards and require two clues for tricky choices.",
        "creator": "Add adversarial examples, confidence scores and a short discussion about training-set diversity."
      },
      "misconception": "AI is not looking with a mind or understanding the animal. It is matching numerical patterns, and unusual lighting or angles can confuse it.",
      "parentSummary": "Your child practised evidence-based sorting and learned that computer vision can be useful without being perfect.",
      "productionAssets": [
        "Pip robot character",
        "Pixel Pet Shelter background",
        "Animal card set",
        "Three folder icons",
        "Pixel Detective badge"
      ]
    },
    {
      "id": "sound-safari",
      "number": 2,
      "title": "Sound Safari: How Does AI Hear?",
      "mission": "Match mystery sounds to the correct source.",
      "concept": "audio recognition",
      "badgeId": "sound-scout",
      "learnerTime": "30–45 minutes",
      "xpReward": 60,
      "objectives": [
        "Name three useful sound features.",
        "Explain why noise can change a prediction.",
        "Choose a safe response when speech is unclear."
      ],
      "vocabulary": [
        "sound wave",
        "pitch",
        "rhythm",
        "noise",
        "speech recognition"
      ],
      "materials": [
        "Six safe sound clips or tutor-made sound effects",
        "Sound Safari recording sheet",
        "Headphones if available"
      ],
      "components": [
        {
          "name": "Lesson video",
          "time": "10 min",
          "purpose": "Story, concept explanation and guided pauses"
        },
        {
          "name": "Eyes-Closed Sound Hunt",
          "time": "10–12 min",
          "purpose": "Hands-on or interactive practice"
        },
        {
          "name": "Independent mission",
          "time": "8–12 min",
          "purpose": "Apply the concept without step-by-step help"
        },
        {
          "name": "Quiz and reflection",
          "time": "5 min",
          "purpose": "Check understanding and explain one key idea"
        }
      ],
      "scenes": [
        {
          "id": "cold-open",
          "label": "Cold open",
          "time": "0:00–0:50",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Could you recognize rain, applause or a lion without seeing anything? Meet Pip, our curious robot, and Glitch, a tiny bug who loves making silly mistakes. Today your mission is match mystery sounds to the correct source. Watch carefully, because the first clue appears before the countdown reaches zero. Ready? Three, two, one — mission start!"
            }
          ],
          "visual": "Fast animated opening. Show a dark screen with animated sound waves and three mystery icons. Display mission badge: Sound Scout.",
          "isPause": false
        },
        {
          "id": "mission-briefing",
          "label": "Mission briefing",
          "time": "0:50–1:45",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Here is the problem. The Jungle Radio has lost all its labels. Pip hears chirps, roars, splashes and machines, but the sound files are mixed together. Pip cannot solve it alone, because AI needs clear information and careful testing. Your job is not only to find an answer. Your job is to explain how you know. That is what real AI detectives and creators do."
            }
          ],
          "visual": "Introduce the story setting: the Jungle Radio sound station. Show Pip looking puzzled and a simple mission map.",
          "isPause": false
        },
        {
          "id": "try-before-telling",
          "label": "Try before telling",
          "time": "1:45–3:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Before I explain anything, try this. Close your eyes and listen to three short sound descriptions or recordings. Which clue tells you whether the sound is natural, human-made or an animal? Pause the video for thirty seconds. Make your choice, point to it, or write it down. Welcome back. Did you notice that you used clues rather than magic? You looked for patterns, compared possibilities, and made a decision."
            }
          ],
          "visual": "Show the learner prompt with a 30-second countdown. Use large icons and very little text. Animate waveforms while the source stays hidden.",
          "isPause": true
        },
        {
          "id": "the-big-ai-idea",
          "label": "The big AI idea",
          "time": "3:00–4:35",
          "turns": [
            {
              "speaker": "tutor",
              "text": "The big idea today is audio recognition. Audio recognition compares patterns in sound. Useful clues include pitch, rhythm, loudness, length and repeated sound shapes. Speech recognition focuses on patterns that represent spoken words. AI does not understand the world exactly as a person does. It follows patterns found in examples, rules, or signals. That can be useful, but it also means we must check its work."
            }
          ],
          "visual": "Animate the concept using three simple steps: sound wave enters, sound features are measured, source or word is predicted. Highlight the key word audio recognition.",
          "isPause": false
        },
        {
          "id": "worked-example",
          "label": "Worked example",
          "time": "4:35–6:05",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Let us solve one together. A short “tap-tap-tap” could be rain, typing or footsteps. We listen for speed, background sound and whether the taps are sharp or soft. One clue is rarely enough, so we combine several. First, we collect the clues. Next, we compare them. Then, we make a choice and test it. If the answer is wrong, we do not say, ‘The robot is bad.’ We ask, ‘Which clue, example, or rule needs improving?’"
            }
          ],
          "visual": "Step-by-step demonstration with check marks. Show three waveforms and icons for pitch, rhythm and background noise.",
          "isPause": false
        },
        {
          "id": "your-turn",
          "label": "Your turn",
          "time": "6:05–7:30",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Now it is your turn. Decide whether a noisy recording says “cat,” “cap,” or “can.” Explain what extra information would make the answer safer. Pause for up to one minute. When you return, say your answer aloud using this sentence: ‘I chose ___ because ___.’ Welcome back. A strong answer includes both the choice and the reason."
            }
          ],
          "visual": "Display three choices and a one-minute pause screen. Three speech bubbles and a “play again” button.",
          "isPause": true
        },
        {
          "id": "glitch-alert",
          "label": "Glitch alert",
          "time": "7:30–8:55",
          "turns": [
            {
              "speaker": "glitch",
              "text": "I know! The AI answer must always be correct!"
            },
            {
              "speaker": "tutor",
              "text": "Glitch, that is today’s trap. A microphone does not give AI perfect hearing. Noise, accents, distance and similar-sounding words can change the result. We should be curious, not afraid, when an AI makes a mistake. A mistake is a clue that helps us improve the data, the rule, or the way a person uses the tool."
            }
          ],
          "visual": "Glitch confidently gives a wrong answer; freeze-frame with a playful buzzer. Show ‘Check, Question, Improve.’",
          "isPause": false
        },
        {
          "id": "recap-and-badge",
          "label": "Recap and badge",
          "time": "8:55–10:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Mission complete. Today you learned three things. One: sound has patterns such as pitch and rhythm. Two: several sounds can share similar clues. Three: replaying or asking for confirmation can reduce mistakes. Your next task is the Eyes-Closed Sound Hunt. Complete it to earn the Sound Scout badge. Before you go, tell someone at home: ‘Today I discovered that AI ___.’ See you on the next mission!"
            }
          ],
          "visual": "Recap cards, badge animation, and preview of the activity. End with the course progress map moving forward one step.",
          "isPause": false
        }
      ],
      "activity": {
        "title": "Eyes-Closed Sound Hunt",
        "purpose": "Practise audio recognition through a concrete, child-led task.",
        "time": "10–12 min",
        "steps": [
          "Play or make one sound while learners close their eyes.",
          "Learners choose a source and record two clues.",
          "Reveal the source and compare the useful clues.",
          "Add background noise and repeat one sound.",
          "Discuss which confirmation question a voice assistant should ask."
        ]
      },
      "independentMission": "Record two similar sounds, such as tapping a desk and tapping a box. Ask someone to tell them apart and list the strongest clue.",
      "quiz": [
        {
          "question": "Which feature describes how high or low a sound is?",
          "options": [
            "Pitch",
            "Color",
            "Weight"
          ],
          "answer": "Pitch",
          "explanation": "Pitch describes perceived highness or lowness."
        },
        {
          "question": "What can make speech recognition harder?",
          "options": [
            "Background noise",
            "A clear microphone",
            "Repeating slowly"
          ],
          "answer": "Background noise",
          "explanation": "Noise can cover or distort important sound patterns."
        },
        {
          "question": "What is a safe response to an unclear command?",
          "options": [
            "Pretend to understand",
            "Ask the person to repeat or confirm",
            "Choose a random action"
          ],
          "answer": "Ask the person to repeat or confirm",
          "explanation": "Confirmation prevents risky guesses."
        },
        {
          "question": "Why can “cat” and “cap” be confused?",
          "options": [
            "Their sound patterns are similar",
            "They have the same meaning",
            "Microphones prefer hats"
          ],
          "answer": "Their sound patterns are similar",
          "explanation": "Only the final sound differs."
        },
        {
          "question": "Does louder always mean easier to recognize?",
          "options": [
            "Yes",
            "No, distortion can also increase",
            "Only for animal sounds"
          ],
          "answer": "No, distortion can also increase",
          "explanation": "Very loud audio may clip and lose detail."
        }
      ],
      "differentiation": {
        "explorer": "Use familiar animal and household sounds; answer by holding up picture cards.",
        "builder": "Add pitch, rhythm and noise vocabulary and a simple evidence table.",
        "creator": "Introduce spectrograms, accent diversity and false activation in voice assistants."
      },
      "misconception": "A microphone does not give AI perfect hearing. Noise, accents, distance and similar-sounding words can change the result.",
      "parentSummary": "Your child explored how machines recognize sound and why voice systems should ask for confirmation when uncertain.",
      "productionAssets": [
        "Jungle Radio background",
        "Animated waveforms",
        "Sound-source icons",
        "Replay button graphic",
        "Sound Scout badge"
      ]
    },
    {
      "id": "human-or-machine",
      "number": 3,
      "title": "Human or Machine? The Creative Clue Game",
      "mission": "Investigate whether a picture, sentence or tune came from a person or a machine.",
      "concept": "source evaluation",
      "badgeId": "source-sleuth",
      "learnerTime": "30–45 minutes",
      "xpReward": 60,
      "objectives": [
        "Distinguish weak style clues from stronger source evidence.",
        "Use sure, likely and unsure appropriately.",
        "Explain why false accusations can be harmful."
      ],
      "vocabulary": [
        "source",
        "evidence",
        "metadata",
        "confidence",
        "generated"
      ],
      "materials": [
        "Six teacher-prepared creations with known sources",
        "Confidence cards: Sure, Likely, Unsure",
        "Clue request sheet"
      ],
      "components": [
        {
          "name": "Lesson video",
          "time": "10 min",
          "purpose": "Story, concept explanation and guided pauses"
        },
        {
          "name": "Gallery Source Investigation",
          "time": "12–15 min",
          "purpose": "Hands-on or interactive practice"
        },
        {
          "name": "Independent mission",
          "time": "8–12 min",
          "purpose": "Apply the concept without step-by-step help"
        },
        {
          "name": "Quiz and reflection",
          "time": "5 min",
          "purpose": "Check understanding and explain one key idea"
        }
      ],
      "scenes": [
        {
          "id": "cold-open",
          "label": "Cold open",
          "time": "0:00–0:50",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Can you always tell whether a person or a computer created something? Meet Pip, our curious robot, and Glitch, a tiny bug who loves making silly mistakes. Today your mission is investigate whether a picture, sentence or tune came from a person or a machine. Watch carefully, because the first clue appears before the countdown reaches zero. Ready? Three, two, one — mission start!"
            }
          ],
          "visual": "Fast animated opening. Show two mystery doors labelled Human and Machine with art, text and music clues floating between them. Display mission badge: Source Sleuth.",
          "isPause": false
        },
        {
          "id": "mission-briefing",
          "label": "Mission briefing",
          "time": "0:50–1:45",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Here is the problem. The Academy gallery has received six anonymous creations. The curator wants labels, but some clues are misleading and there may not be enough evidence. Pip cannot solve it alone, because AI needs clear information and careful testing. Your job is not only to find an answer. Your job is to explain how you know. That is what real AI detectives and creators do."
            }
          ],
          "visual": "Introduce the story setting: the Mystery Makers Gallery. Show Pip looking puzzled and a simple mission map.",
          "isPause": false
        },
        {
          "id": "try-before-telling",
          "label": "Try before telling",
          "time": "1:45–3:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Before I explain anything, try this. Read two tiny stories. Which one feels more likely to be machine-made, and what evidence supports your guess? Remember that “strange” does not automatically mean “AI.” Pause the video for thirty seconds. Make your choice, point to it, or write it down. Welcome back. Did you notice that you used clues rather than magic? You looked for patterns, compared possibilities, and made a decision."
            }
          ],
          "visual": "Show the learner prompt with a 30-second countdown. Use large icons and very little text. Show two short original sentences with clue magnifiers.",
          "isPause": true
        },
        {
          "id": "the-big-ai-idea",
          "label": "The big AI idea",
          "time": "3:00–4:35",
          "turns": [
            {
              "speaker": "tutor",
              "text": "The big idea today is source evaluation. Source evaluation means checking where something came from and how reliable the evidence is. Style clues can help, but metadata, creator statements and the creation process are stronger than guessing from appearance alone. AI does not understand the world exactly as a person does. It follows patterns found in examples, rules, or signals. That can be useful, but it also means we must check its work."
            }
          ],
          "visual": "Animate the concept using three simple steps: observe the item, inspect source clues, choose a confidence level. Highlight the key word source evaluation.",
          "isPause": false
        },
        {
          "id": "worked-example",
          "label": "Worked example",
          "time": "4:35–6:05",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Let us solve one together. A perfect-looking landscape could be painted, photographed or generated. Repeated fingers in a character drawing may be a clue, but a human can also make mistakes. We mark our conclusion as sure, likely or unsure and name the evidence. First, we collect the clues. Next, we compare them. Then, we make a choice and test it. If the answer is wrong, we do not say, ‘The robot is bad.’ We ask, ‘Which clue, example, or rule needs improving?’"
            }
          ],
          "visual": "Step-by-step demonstration with check marks. Use a three-level confidence meter and reveal progressively stronger evidence.",
          "isPause": false
        },
        {
          "id": "your-turn",
          "label": "Your turn",
          "time": "6:05–7:30",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Now it is your turn. Examine a poem with repeated phrases. Decide whether you are sure, likely or unsure about its source, then request one stronger clue. Pause for up to one minute. When you return, say your answer aloud using this sentence: ‘I chose ___ because ___.’ Welcome back. A strong answer includes both the choice and the reason."
            }
          ],
          "visual": "Display three choices and a one-minute pause screen. Confidence buttons plus options: author note, file history, original sketch.",
          "isPause": true
        },
        {
          "id": "glitch-alert",
          "label": "Glitch alert",
          "time": "7:30–8:55",
          "turns": [
            {
              "speaker": "glitch",
              "text": "I know! The AI answer must always be correct!"
            },
            {
              "speaker": "tutor",
              "text": "Glitch, that is today’s trap. There is no single magical clue that proves something was made by AI. Responsible detectives avoid accusing a creator without reliable evidence. We should be curious, not afraid, when an AI makes a mistake. A mistake is a clue that helps us improve the data, the rule, or the way a person uses the tool."
            }
          ],
          "visual": "Glitch confidently gives a wrong answer; freeze-frame with a playful buzzer. Show ‘Check, Question, Improve.’",
          "isPause": false
        },
        {
          "id": "recap-and-badge",
          "label": "Recap and badge",
          "time": "8:55–10:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Mission complete. Today you learned three things. One: appearance alone may not reveal the creator. Two: strong source evidence is better than a feeling. Three: uncertainty should be stated honestly. Your next task is the Gallery Source Investigation. Complete it to earn the Source Sleuth badge. Before you go, tell someone at home: ‘Today I discovered that AI ___.’ See you on the next mission!"
            }
          ],
          "visual": "Recap cards, badge animation, and preview of the activity. End with the course progress map moving forward one step.",
          "isPause": false
        }
      ],
      "activity": {
        "title": "Gallery Source Investigation",
        "purpose": "Practise source evaluation through a concrete, child-led task.",
        "time": "12–15 min",
        "steps": [
          "Inspect one creation without source information.",
          "Record a first guess and confidence level.",
          "Reveal a style clue, then a process clue.",
          "Update the conclusion if the evidence changes.",
          "Write one rule for making a fair source claim."
        ]
      },
      "independentMission": "Create a drawing or paragraph that intentionally looks “machine-like.” Use it to demonstrate why style alone is weak evidence.",
      "quiz": [
        {
          "question": "Which is the strongest source clue?",
          "options": [
            "It looks unusual",
            "The original file history and creator record",
            "A friend guessed AI"
          ],
          "answer": "The original file history and creator record",
          "explanation": "Process and provenance evidence are stronger than appearance."
        },
        {
          "question": "What should you say when evidence is weak?",
          "options": [
            "I am completely sure",
            "I am unsure and need more evidence",
            "The creator is lying"
          ],
          "answer": "I am unsure and need more evidence",
          "explanation": "Honest uncertainty avoids unfair claims."
        },
        {
          "question": "Can humans make strange mistakes?",
          "options": [
            "Yes",
            "No",
            "Only in music"
          ],
          "answer": "Yes",
          "explanation": "Human work can also contain repetition or errors."
        },
        {
          "question": "What does confidence describe?",
          "options": [
            "How loudly you speak",
            "How certain the conclusion is",
            "How colorful the picture is"
          ],
          "answer": "How certain the conclusion is",
          "explanation": "Confidence communicates certainty."
        },
        {
          "question": "Why avoid accusing someone without evidence?",
          "options": [
            "It may be unfair and harmful",
            "It makes the gallery too quiet",
            "AI never creates anything"
          ],
          "answer": "It may be unfair and harmful",
          "explanation": "Claims about authorship affect trust and reputation."
        }
      ],
      "differentiation": {
        "explorer": "Use drawings and simple confidence faces: sure, maybe, not sure.",
        "builder": "Use mixed media and require one observation plus one source clue.",
        "creator": "Discuss provenance, watermarks, metadata limits and false-positive detection."
      },
      "misconception": "There is no single magical clue that proves something was made by AI. Responsible detectives avoid accusing a creator without reliable evidence.",
      "parentSummary": "Your child learned not to make confident claims about AI authorship from appearance alone.",
      "productionAssets": [
        "Mystery gallery background",
        "Human/Machine doors",
        "Confidence meter",
        "Evidence cards",
        "Source Sleuth badge"
      ]
    },
    {
      "id": "glitch-hunt",
      "number": 4,
      "title": "Glitch Hunt: Why AI Makes Mistakes",
      "mission": "Find the cause of three funny AI failures and propose a fix.",
      "concept": "error analysis",
      "badgeId": "glitch-buster",
      "learnerTime": "30–45 minutes",
      "xpReward": 60,
      "objectives": [
        "Use an error-analysis cycle.",
        "Match common errors to possible causes.",
        "Explain why test examples should be separate."
      ],
      "vocabulary": [
        "error",
        "cause",
        "hypothesis",
        "test set",
        "improve"
      ],
      "materials": [
        "Three Glitch Case cards",
        "Cause and Fix cards",
        "Simple test record"
      ],
      "components": [
        {
          "name": "Lesson video",
          "time": "10 min",
          "purpose": "Story, concept explanation and guided pauses"
        },
        {
          "name": "Glitch Case Files",
          "time": "12–15 min",
          "purpose": "Hands-on or interactive practice"
        },
        {
          "name": "Independent mission",
          "time": "8–12 min",
          "purpose": "Apply the concept without step-by-step help"
        },
        {
          "name": "Quiz and reflection",
          "time": "5 min",
          "purpose": "Check understanding and explain one key idea"
        }
      ],
      "scenes": [
        {
          "id": "cold-open",
          "label": "Cold open",
          "time": "0:00–0:50",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Why might an AI call a muffin a puppy or send a robot vacuum toward a dark rug? Meet Pip, our curious robot, and Glitch, a tiny bug who loves making silly mistakes. Today your mission is find the cause of three funny AI failures and propose a fix. Watch carefully, because the first clue appears before the countdown reaches zero. Ready? Three, two, one — mission start!"
            }
          ],
          "visual": "Fast animated opening. Show a muffin labelled puppy and a robot vacuum stopping at a dark rug. Display mission badge: Glitch Buster.",
          "isPause": false
        },
        {
          "id": "mission-briefing",
          "label": "Mission briefing",
          "time": "0:50–1:45",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Here is the problem. Glitch has scrambled the Academy systems. The picture sorter, voice helper and route robot are each failing for a different reason. Pip cannot solve it alone, because AI needs clear information and careful testing. Your job is not only to find an answer. Your job is to explain how you know. That is what real AI detectives and creators do."
            }
          ],
          "visual": "Introduce the story setting: the Academy Glitch Lab. Show Pip looking puzzled and a simple mission map.",
          "isPause": false
        },
        {
          "id": "try-before-telling",
          "label": "Try before telling",
          "time": "1:45–3:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Before I explain anything, try this. Match each failure to a possible cause: poor examples, unclear input, or a rule that does not fit the situation. Pause the video for thirty seconds. Make your choice, point to it, or write it down. Welcome back. Did you notice that you used clues rather than magic? You looked for patterns, compared possibilities, and made a decision."
            }
          ],
          "visual": "Show the learner prompt with a 30-second countdown. Use large icons and very little text. Three error cards and three cause cards for matching.",
          "isPause": true
        },
        {
          "id": "the-big-ai-idea",
          "label": "The big AI idea",
          "time": "3:00–4:35",
          "turns": [
            {
              "speaker": "tutor",
              "text": "The big idea today is error analysis. Error analysis means studying a wrong result to understand its cause. We inspect the input, training examples, labels, rules and testing conditions instead of changing everything at once. AI does not understand the world exactly as a person does. It follows patterns found in examples, rules, or signals. That can be useful, but it also means we must check its work."
            }
          ],
          "visual": "Animate the concept using three simple steps: observe the error, form a cause hypothesis, test one improvement. Highlight the key word error analysis.",
          "isPause": false
        },
        {
          "id": "worked-example",
          "label": "Worked example",
          "time": "4:35–6:05",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Let us solve one together. The sorter calls a blueberry muffin a puppy because many training pictures show round brown puppy faces and round brown muffins. We add varied examples and a clue about texture, then test on new pictures rather than the same ones. First, we collect the clues. Next, we compare them. Then, we make a choice and test it. If the answer is wrong, we do not say, ‘The robot is bad.’ We ask, ‘Which clue, example, or rule needs improving?’"
            }
          ],
          "visual": "Step-by-step demonstration with check marks. Show before-and-after example sets and a separate test folder.",
          "isPause": false
        },
        {
          "id": "your-turn",
          "label": "Your turn",
          "time": "6:05–7:30",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Now it is your turn. A voice helper keeps hearing “play” when the learner says “plane.” Choose one change to test first and explain why. Pause for up to one minute. When you return, say your answer aloud using this sentence: ‘I chose ___ because ___.’ Welcome back. A strong answer includes both the choice and the reason."
            }
          ],
          "visual": "Display three choices and a one-minute pause screen. Options: reduce noise, add random pictures, change screen color.",
          "isPause": true
        },
        {
          "id": "glitch-alert",
          "label": "Glitch alert",
          "time": "7:30–8:55",
          "turns": [
            {
              "speaker": "glitch",
              "text": "I know! The AI answer must always be correct!"
            },
            {
              "speaker": "tutor",
              "text": "Glitch, that is today’s trap. A mistake does not prove that all AI is useless, and one correct answer does not prove it is reliable. We need repeated, fair tests. We should be curious, not afraid, when an AI makes a mistake. A mistake is a clue that helps us improve the data, the rule, or the way a person uses the tool."
            }
          ],
          "visual": "Glitch confidently gives a wrong answer; freeze-frame with a playful buzzer. Show ‘Check, Question, Improve.’",
          "isPause": false
        },
        {
          "id": "recap-and-badge",
          "label": "Recap and badge",
          "time": "8:55–10:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Mission complete. Today you learned three things. One: wrong results can have different causes. Two: change one thing and test again. Three: new test examples reveal whether a fix truly works. Your next task is the Glitch Case Files. Complete it to earn the Glitch Buster badge. Before you go, tell someone at home: ‘Today I discovered that AI ___.’ See you on the next mission!"
            }
          ],
          "visual": "Recap cards, badge animation, and preview of the activity. End with the course progress map moving forward one step.",
          "isPause": false
        }
      ],
      "activity": {
        "title": "Glitch Case Files",
        "purpose": "Practise error analysis through a concrete, child-led task.",
        "time": "12–15 min",
        "steps": [
          "Read a case file and circle the wrong result.",
          "Choose the most likely cause and explain the evidence.",
          "Select one fix rather than changing everything.",
          "Predict what should improve after the fix.",
          "Test with a new example and record the result."
        ]
      },
      "independentMission": "Invent a funny AI mistake, then write two possible causes and the first test you would run.",
      "quiz": [
        {
          "question": "What is the first step in error analysis?",
          "options": [
            "Hide the mistake",
            "Observe exactly what went wrong",
            "Replace the whole system"
          ],
          "answer": "Observe exactly what went wrong",
          "explanation": "A clear error description guides investigation."
        },
        {
          "question": "Why change one thing at a time?",
          "options": [
            "To know which change helped",
            "Because two is unlucky",
            "To make testing slower"
          ],
          "answer": "To know which change helped",
          "explanation": "Controlled changes reveal cause and effect."
        },
        {
          "question": "Why use new test examples?",
          "options": [
            "To check whether improvement generalizes",
            "To make the folder larger",
            "Old examples disappear"
          ],
          "answer": "To check whether improvement generalizes",
          "explanation": "Testing on memorized examples can be misleading."
        },
        {
          "question": "One correct answer means the system is always reliable.",
          "options": [
            "True",
            "False",
            "Only for robots"
          ],
          "answer": "False",
          "explanation": "Reliability requires repeated and varied testing."
        },
        {
          "question": "Which is a possible cause of speech error?",
          "options": [
            "Background noise",
            "A blue button",
            "The learner’s shoe size"
          ],
          "answer": "Background noise",
          "explanation": "Noise affects the audio signal."
        }
      ],
      "differentiation": {
        "explorer": "Use illustrated case cards and act out “wrong result, possible cause, try again.”",
        "builder": "Use the full cause-fix-test worksheet.",
        "creator": "Introduce precision, recall, edge cases and controlled experiments."
      },
      "misconception": "A mistake does not prove that all AI is useless, and one correct answer does not prove it is reliable. We need repeated, fair tests.",
      "parentSummary": "Your child learned a calm, scientific way to investigate technology mistakes instead of simply trusting or rejecting the system.",
      "productionAssets": [
        "Glitch Lab background",
        "Three error animations",
        "Cause/Fix cards",
        "Test folders",
        "Glitch Buster badge"
      ]
    },
    {
      "id": "build-the-picture-detective",
      "number": 5,
      "title": "Build the Picture Detective",
      "mission": "Design and test a paper prototype that classifies imaginary creatures.",
      "concept": "training and testing a classifier",
      "badgeId": "chief-ai-detective",
      "learnerTime": "30–45 minutes",
      "xpReward": 60,
      "objectives": [
        "Create labels and useful features for a classification task.",
        "Build a simple decision rule or tree.",
        "Test with unseen and ambiguous examples."
      ],
      "vocabulary": [
        "training data",
        "test data",
        "decision rule",
        "classifier",
        "unseen example"
      ],
      "materials": [
        "Printable imaginary creature cards",
        "Feature checklist",
        "Decision-tree sheet",
        "Training and Test envelopes"
      ],
      "components": [
        {
          "name": "Lesson video",
          "time": "10 min",
          "purpose": "Story, concept explanation and guided pauses"
        },
        {
          "name": "Creature Classifier Lab",
          "time": "15–18 min",
          "purpose": "Hands-on or interactive practice"
        },
        {
          "name": "Independent mission",
          "time": "8–12 min",
          "purpose": "Apply the concept without step-by-step help"
        },
        {
          "name": "Quiz and reflection",
          "time": "5 min",
          "purpose": "Check understanding and explain one key idea"
        }
      ],
      "scenes": [
        {
          "id": "cold-open",
          "label": "Cold open",
          "time": "0:00–0:50",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Can you teach a robot to recognize a Fluffalo, a Zingbat and a Moon Muncher? Meet Pip, our curious robot, and Glitch, a tiny bug who loves making silly mistakes. Today your mission is design and test a paper prototype that classifies imaginary creatures. Watch carefully, because the first clue appears before the countdown reaches zero. Ready? Three, two, one — mission start!"
            }
          ],
          "visual": "Fast animated opening. Show three playful imaginary creatures with different horns, wings and spots. Display mission badge: Chief AI Detective.",
          "isPause": false
        },
        {
          "id": "mission-briefing",
          "label": "Mission briefing",
          "time": "0:50–1:45",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Here is the problem. New creatures have arrived from Planet Pattern, but the Academy database has no labels. Pip needs a clear training guide before the doors open. Pip cannot solve it alone, because AI needs clear information and careful testing. Your job is not only to find an answer. Your job is to explain how you know. That is what real AI detectives and creators do."
            }
          ],
          "visual": "Introduce the story setting: Planet Pattern Research Camp. Show Pip looking puzzled and a simple mission map.",
          "isPause": false
        },
        {
          "id": "try-before-telling",
          "label": "Try before telling",
          "time": "1:45–3:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Before I explain anything, try this. Study three creatures and choose the two most useful features for separating them. Are color and size enough? Pause the video for thirty seconds. Make your choice, point to it, or write it down. Welcome back. Did you notice that you used clues rather than magic? You looked for patterns, compared possibilities, and made a decision."
            }
          ],
          "visual": "Show the learner prompt with a 30-second countdown. Use large icons and very little text. Creature cards with feature icons for wings, horns, spots and tail shape.",
          "isPause": true
        },
        {
          "id": "the-big-ai-idea",
          "label": "The big AI idea",
          "time": "3:00–4:35",
          "turns": [
            {
              "speaker": "tutor",
              "text": "The big idea today is training and testing a classifier. A classifier learns a mapping from features to labels. We prepare labelled training examples, create a decision method, and then test it using new examples that were not used to build the method. AI does not understand the world exactly as a person does. It follows patterns found in examples, rules, or signals. That can be useful, but it also means we must check its work."
            }
          ],
          "visual": "Animate the concept using three simple steps: label training cards, create feature rules, test unseen creatures. Highlight the key word training and testing a classifier.",
          "isPause": false
        },
        {
          "id": "worked-example",
          "label": "Worked example",
          "time": "4:35–6:05",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Let us solve one together. Fluffalos have two round horns and cloud tails. Zingbats have wings and zigzag tails. We test a creature with wings and a cloud tail. The rules conflict, so the safe output is unsure until we decide which feature is more important or collect more examples. First, we collect the clues. Next, we compare them. Then, we make a choice and test it. If the answer is wrong, we do not say, ‘The robot is bad.’ We ask, ‘Which clue, example, or rule needs improving?’"
            }
          ],
          "visual": "Step-by-step demonstration with check marks. Build a simple decision tree and show the conflict reaching Unsure.",
          "isPause": false
        },
        {
          "id": "your-turn",
          "label": "Your turn",
          "time": "6:05–7:30",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Now it is your turn. Classify a new creature using your rule sheet, then trade with a partner who tries to break your rules using a tricky card. Pause for up to one minute. When you return, say your answer aloud using this sentence: ‘I chose ___ because ___.’ Welcome back. A strong answer includes both the choice and the reason."
            }
          ],
          "visual": "Display three choices and a one-minute pause screen. Decision-tree path and a challenge envelope.",
          "isPause": true
        },
        {
          "id": "glitch-alert",
          "label": "Glitch alert",
          "time": "7:30–8:55",
          "turns": [
            {
              "speaker": "glitch",
              "text": "I know! The AI answer must always be correct!"
            },
            {
              "speaker": "tutor",
              "text": "Glitch, that is today’s trap. A classifier is not “smart” just because it works on the examples used to design it. The real test is how it handles new and unusual examples. We should be curious, not afraid, when an AI makes a mistake. A mistake is a clue that helps us improve the data, the rule, or the way a person uses the tool."
            }
          ],
          "visual": "Glitch confidently gives a wrong answer; freeze-frame with a playful buzzer. Show ‘Check, Question, Improve.’",
          "isPause": false
        },
        {
          "id": "recap-and-badge",
          "label": "Recap and badge",
          "time": "8:55–10:00",
          "turns": [
            {
              "speaker": "tutor",
              "text": "Mission complete. Today you learned three things. One: training examples teach the categories. Two: features and labels must be clear. Three: unseen test examples reveal strengths and weaknesses. Your next task is the Creature Classifier Lab. Complete it to earn the Chief AI Detective badge. Before you go, tell someone at home: ‘Today I discovered that AI ___.’ See you on the next mission!"
            }
          ],
          "visual": "Recap cards, badge animation, and preview of the activity. End with the course progress map moving forward one step.",
          "isPause": false
        }
      ],
      "activity": {
        "title": "Creature Classifier Lab",
        "purpose": "Practise training and testing a classifier through a concrete, child-led task.",
        "time": "15–18 min",
        "steps": [
          "Place eight labelled cards in the Training envelope.",
          "List features that distinguish the three creature types.",
          "Write a decision tree with an Unsure outcome.",
          "Open four unseen Test cards and classify them.",
          "Record errors and improve only one part of the rules."
        ]
      },
      "independentMission": "Design one new creature card that exposes a weakness in the current classifier. Explain the weakness and propose a responsible fix.",
      "quiz": [
        {
          "question": "Which examples should be used for the final test?",
          "options": [
            "Only the training cards",
            "New cards not used to build the rules",
            "The easiest card repeated"
          ],
          "answer": "New cards not used to build the rules",
          "explanation": "Unseen data gives a fairer test."
        },
        {
          "question": "What is a label?",
          "options": [
            "The category name",
            "The picture size",
            "A sound effect"
          ],
          "answer": "The category name",
          "explanation": "Labels identify the target category."
        },
        {
          "question": "Why include an Unsure result?",
          "options": [
            "Some cases do not have enough clear evidence",
            "It makes every answer wrong",
            "Robots dislike choices"
          ],
          "answer": "Some cases do not have enough clear evidence",
          "explanation": "Uncertainty is safer than forced guessing."
        },
        {
          "question": "What should happen after a test error?",
          "options": [
            "Study the cause and improve the rule or examples",
            "Erase the result",
            "Claim the test is unfair"
          ],
          "answer": "Study the cause and improve the rule or examples",
          "explanation": "Errors guide improvement."
        },
        {
          "question": "A model that remembers training cards but fails on new cards is:",
          "options": [
            "Well tested",
            "Not generalizing well",
            "Always correct"
          ],
          "answer": "Not generalizing well",
          "explanation": "It has not learned a useful general pattern."
        }
      ],
      "differentiation": {
        "explorer": "Tutor reads the rules; children sort six creatures using picture symbols.",
        "builder": "Children build a simple branching decision tree and test four unseen cards.",
        "creator": "Add train/validation/test splits and calculate basic accuracy by category."
      },
      "misconception": "A classifier is not “smart” just because it works on the examples used to design it. The real test is how it handles new and unusual examples.",
      "parentSummary": "Your child completed a full miniature AI workflow: define categories, train with examples, test on new cases and improve responsibly.",
      "productionAssets": [
        "Planet Pattern background",
        "Creature card pack",
        "Decision-tree graphics",
        "Training/Test envelopes",
        "Chief AI Detective badge"
      ]
    }
  ],
  "badgeId": "ai-detective-academy",
  "completionXp": 100,
  "difficulty": "beginner",
  "topics": [
    "Perception",
    "Evidence"
  ],
  "image": "courses/ai-ethics.webp",
  "accent": "purple",
  "status": "available"
};

