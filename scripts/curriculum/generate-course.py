#!/usr/bin/env python3
"""Turn the parsed curriculum JSON into a typed TypeScript data module."""
import json
import re
import sys

XP_PER_LESSON = 60

PAUSE_SCENES = {'Try before telling', 'Your turn'}


def slug(text):
    head = re.split(r'[:?]', text)[0]
    return re.sub(r'[^a-z0-9]+', '-', head.lower()).strip('-')


def turns(narration):
    """'Glitch: ... Tutor: ...' -> [{speaker, text}, ...]"""
    parts = re.split(r'(Tutor:|Glitch:)', narration)
    out = []
    speaker = None
    for part in parts:
        if part in ('Tutor:', 'Glitch:'):
            speaker = part[:-1].lower()
        elif part.strip() and speaker:
            out.append({'speaker': speaker, 'text': part.strip()})
    return out or [{'speaker': 'tutor', 'text': narration.strip()}]


def lesson_object(index, raw):
    return {
        'id': slug(raw['title']),
        'number': index,
        'title': raw['title'],
        'mission': raw['mission'],
        'concept': raw['concept'],
        'badgeId': slug(raw['badge']),
        'learnerTime': raw['learnerTime'],
        'xpReward': XP_PER_LESSON,
        'objectives': raw['objectives'],
        'vocabulary': raw['vocabulary'],
        'materials': raw['materials'],
        'components': raw['components'],
        'scenes': [
            {
                'id': slug(s['scene']),
                'label': s['scene'],
                'time': s['time'],
                'turns': turns(s['narration']),
                'visual': s['visual'],
                'isPause': s['scene'] in PAUSE_SCENES,
            }
            for s in raw['scenes']
        ],
        'activity': {
            'title': raw['activity']['title'],
            'purpose': raw['activity']['purpose'],
            'time': raw['activity']['time'],
            'steps': raw['activity']['steps'],
        },
        'independentMission': raw['independentMission'],
        'quiz': raw['quiz'],
        'differentiation': raw['differentiation'],
        'misconception': raw['misconception'],
        'parentSummary': raw['parentSummary'],
        'productionAssets': raw['assets'],
    }


HEADER = '''import type { Course } from '@/types/course';

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
export const aiDetectiveAcademy: Course = '''


def main():
    lessons = json.load(open(sys.argv[1]))
    course = {
        'id': 'ai-detective-academy',
        'title': 'AI Detective Academy',
        'tagline': 'Use clues to discover how AI sees, hears, compares and sometimes gets things wrong.',
        'outcomes': [
            'Explain that AI uses patterns and signals rather than human understanding.',
            'Compare human and machine strengths in simple perception tasks.',
            'Test an AI-like system and describe why mistakes happen.',
            'Use evidence and clear reasoning to support a conclusion.',
        ],
        'lessons': [lesson_object(i, l) for i, l in enumerate(lessons, 1)],
        'badgeId': 'ai-detective-academy',
        'completionXp': 100,
        'difficulty': 'beginner',
        'topics': ['Perception', 'Evidence'],
        'image': 'courses/ai-ethics.webp',
        'accent': 'purple',
        'status': 'available',
    }
    body = json.dumps(course, indent=2, ensure_ascii=False)
    print(HEADER + body + ';\n')


main()
