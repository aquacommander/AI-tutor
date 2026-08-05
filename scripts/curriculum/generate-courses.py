#!/usr/bin/env python3
"""
Emit src/data/courses/*.ts from the parsed revised plan.

Merges three sources, each kept separate on purpose:
  - the parsed document (authoritative content)
  - distractors.json (authored by hand, needs tutor review)
  - the real video files on disk (duration read from the file, never the plan)

Usage:
  python3 scripts/curriculum/parse-revised.py > revised.json
  python3 scripts/curriculum/generate-courses.py revised.json
"""
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
DISTRACTORS = json.loads((HERE / 'distractors.json').read_text())
CHILD_MISSIONS = json.loads((HERE / 'child-missions.json').read_text())

XP_PER_LESSON = 60
XP_PER_CAPSTONE = 150

META = {
    'ai-detective-academy': {
        'tagline': 'Use clues to discover how AI sees, hears, compares and sometimes gets things wrong.',
        'outcomes': [
            'Explain that AI uses patterns and signals rather than human understanding.',
            'Compare human and machine strengths in simple perception tasks.',
            'Test an AI-like system and describe why mistakes happen.',
            'Use evidence and clear reasoning to support a conclusion.',
        ],
        'difficulty': 'beginner',
        'topics': ['Perception', 'Evidence'],
        'image': 'courses/ai-ethics.webp',
        'accent': 'purple',
    },
    'train-your-robot-brain': {
        'tagline': 'Choose good clues, clean the data, and discover how machine learning really works.',
        'outcomes': [
            'Choose features that are relevant, measurable and safe.',
            'Spot duplicates, missing labels and imbalance in a dataset.',
            'Explain why a machine can estimate tone but not know a feeling.',
            'Use a train-tune-test cycle to make a simple model better.',
        ],
        'difficulty': 'beginner',
        'topics': ['Machine Learning', 'Data'],
        'image': 'courses/data-science.webp',
        'accent': 'blue',
    },
    'ai-game-creator-lab': {
        'tagline': 'Design characters, choices and mazes while learning how intelligent games are built.',
        'outcomes': [
            'Break a game into inputs, states and actions.',
            'Write if-then rules and give them a sensible priority.',
            'Plan and test a route, and explain what makes one route cost more.',
            'Build and improve a small game blueprint.',
        ],
        'difficulty': 'intermediate',
        'topics': ['Games', 'Logic'],
        'image': 'courses/game-robotics.webp',
        'accent': 'orange',
    },
    'smart-and-safe-ai-heroes': {
        'tagline': 'Protect privacy, check what is true, and know when a human must decide.',
        'outcomes': [
            'Collect only the information a clear purpose needs.',
            'Check a claim by its source, date, evidence and context.',
            'Explain why popularity is not evidence.',
            'Say when a trusted adult or a human decision is required.',
        ],
        'difficulty': 'intermediate',
        'topics': ['Privacy', 'Safety'],
        'image': 'courses/vision-nlp.webp',
        'accent': 'green',
    },
}

VAR = {
    'ai-detective-academy': 'aiDetectiveAcademy',
    'train-your-robot-brain': 'trainYourRobotBrain',
    'ai-game-creator-lab': 'aiGameCreatorLab',
    'smart-and-safe-ai-heroes': 'smartAndSafeAiHeroes',
}


def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def real_duration(path):
    out = subprocess.check_output(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'default=nw=1:nk=1', path],
        encoding='utf8',
    )
    return round(float(out.strip()))


def split_adaptation(text):
    """'Ages 6-8: ... Ages 13-16: ...' -> the two halves."""
    parts = re.split(r'Ages\s*13[–—-]16:\s*', text)
    younger = re.sub(r'^Ages\s*6[–—-]8:\s*', '', parts[0]).strip()
    older = parts[1].strip() if len(parts) > 1 else ''
    return younger, older


def build_lesson(course_id, raw):
    key = f"{course_id}/{raw['id']}"
    distractors = DISTRACTORS.get(key)
    if not distractors:
        raise SystemExit(f'No distractors authored for {key}')

    child_mission = CHILD_MISSIONS.get(key)
    if not child_mission:
        raise SystemExit(f'No child-voiced mission authored for {key}')

    video_path = f"public/videos/{course_id}/{raw['id']}.mp4"
    if not Path(video_path).exists():
        raise SystemExit(f'Missing video: {video_path}')

    quiz = []
    for index, question in enumerate(raw['quiz']):
        wrong = distractors[index]
        # Correct answer first in the data; the UI shuffles deterministically.
        quiz.append({
            'question': question['question'],
            'options': [question['answer'], *wrong],
            'answer': question['answer'],
            'explanation': question['why'],
        })

    younger, older = split_adaptation(raw['ageAdaptation'])

    return {
        'id': raw['id'],
        'number': raw['number'],
        'title': raw['title'],
        'hook': raw['hook'],
        'watchFocus': raw['watchFocus'],
        'video': {
            'src': f"/videos/{course_id}/{raw['id']}.mp4",
            'poster': f"lesson-posters/{raw['id']}.webp",
            'durationSeconds': real_duration(video_path),
        },
        'concept': {
            # The lesson's own core definition, from its first quiz answer.
            'bigIdea': raw['quiz'][0]['answer'],
            'vocabulary': raw['vocabulary'],
            'objectives': raw['objectives'],
        },
        'activity': {'title': raw['activityTitle'], 'steps': raw['activitySteps']},
        'independentMission': raw['independentMission'],
        'childMission': child_mission,
        'quiz': quiz,
        'adaptation': {'younger': younger, 'older': older},
        'parentTakeaway': raw['parentTakeaway'],
        'badgeId': f"{course_id}-{raw['id']}",
        'xpReward': XP_PER_LESSON,
        'learnerTime': raw['lessonTime'],
    }


HEADER = """import type {{ Course }} from '@/types/course';

/**
 * {title}
 *
 * Generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx by
 * `scripts/curriculum/`. Content comes from that document; the quiz distractors
 * come from `scripts/curriculum/distractors.json` and are authored rather than
 * parsed. Video durations are read from the files themselves, never from the
 * plan — the two disagreed before.
 *
 * Do not hand-edit: re-run the generator instead.
 */
export const {var_name}: Course = """


def main():
    courses = json.loads(Path(sys.argv[1]).read_text())
    Path('src/data/courses').mkdir(parents=True, exist_ok=True)

    for number, raw in enumerate(courses, 1):
        cid = raw['id']
        meta = META[cid]
        cap = raw['capstone']

        course = {
            'id': cid,
            'number': number,
            'title': raw['title'],
            'tagline': meta['tagline'],
            'outcomes': meta['outcomes'],
            'lessons': [build_lesson(cid, l) for l in raw['lessons']],
            'capstone': {
                'id': slug(cap['title']),
                'title': cap['title'],
                'time': cap['time'],
                'badgeId': slug(cap['badge']),
                'summary': cap['summary'],
                'evidence': cap['evidence'],
                'tasks': cap['tasks'],
                'successStandard': cap['successStandard'],
                'xpReward': XP_PER_CAPSTONE,
            },
            'difficulty': meta['difficulty'],
            'topics': meta['topics'],
            'image': meta['image'],
            'accent': meta['accent'],
        }

        out = Path(f'src/data/courses/{cid}.ts')
        body = json.dumps(course, indent=2, ensure_ascii=False)
        out.write_text(HEADER.format(title=raw['title'], var_name=VAR[cid]) + body + ';\n')
        print(f'{out}  {len(course["lessons"])} lessons, capstone {cap["title"]}')


main()
