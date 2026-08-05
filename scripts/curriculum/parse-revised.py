#!/usr/bin/env python3
"""
Parse AI_for_Kids_Revised_14_Video_Course_Plan.docx into JSON.

The revised plan restructures the programme around the 14 films that actually
exist: four courses of 5/4/3/2 lessons plus four capstones, and a six-stage
lesson flow that moves the thinking pauses out of the videos and into the
platform.

Every lesson block carries the same labelled fields in the same order, so the
parse anchors on those labels rather than on line offsets.

Transcription aid, not a source of truth — the output is reviewed before it
becomes app data.

Usage: python3 scripts/curriculum/parse-revised.py > revised.json
"""
import html
import json
import re
import zipfile

DOCX = 'AI_for_Kids_Revised_14_Video_Course_Plan.docx'

COURSES = [
    ('ai-detective-academy', 'Course 1: AI Detective Academy'),
    ('train-your-robot-brain', 'Course 2: Train Your Robot Brain'),
    ('ai-game-creator-lab', 'Course 3: AI Game Creator Lab'),
    ('smart-and-safe-ai-heroes', 'Course 4: Smart and Safe AI Heroes'),
]


def paragraphs(path):
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf8')
    xml = xml.replace('</w:p>', '\n').replace('</w:tc>', '\n')
    text = html.unescape(re.sub(r'<[^>]+>', '', xml))
    return [line.strip() for line in text.split('\n') if line.strip()]


def slug(text):
    head = re.split(r'[:?]', text)[0]
    return re.sub(r'[^a-z0-9]+', '-', head.lower()).strip('-')


def field(lines, label, offset=1):
    """Value on the line(s) after an exact label."""
    i = lines.index(label)
    return lines[i + offset]


def between(lines, start, end):
    a = lines.index(start)
    b = lines.index(end, a)
    return lines[a + 1:b]


def parse_lesson(block, number):
    title = re.sub(r'^Lesson \d+:\s*', '', block[0])

    video_line = field(block, 'Completed video')
    file_match = re.match(r'(.+\.mp4)\s*\((\d+):(\d{2})\)', video_line)
    seconds = int(file_match.group(2)) * 60 + int(file_match.group(3))

    # The quiz is a 3-column table: question, answer, why it matters.
    q = block.index('Why it matters')
    rows = [block[q + 1 + i * 3:q + 4 + i * 3] for i in range(5)]

    activity_label = next(l for l in block if l.startswith('Guided activity:'))
    steps = between(block, activity_label, 'Independent mission')

    return {
        'id': slug(title),
        'number': number,
        'title': title,
        'videoFile': file_match.group(1),
        'videoSeconds': seconds,
        'lessonTime': field(block, 'Total lesson time'),
        'vocabulary': [v.strip() for v in field(block, 'Key vocabulary').split(',')],
        'objectives': between(block, 'Learning objectives', 'Before the video: curiosity hook'),
        'hook': field(block, 'Before the video: curiosity hook'),
        'watchFocus': field(block, 'Watch focus'),
        'activityTitle': activity_label.replace('Guided activity:', '').strip(),
        'activitySteps': [re.sub(r'^\d+\.\s*', '', s) for s in steps],
        'independentMission': field(block, 'Independent mission'),
        'quiz': [{'question': r[0], 'answer': r[1], 'why': r[2]} for r in rows],
        'ageAdaptation': field(block, 'Age adaptation'),
        'parentTakeaway': field(block, 'Parent or teacher takeaway'),
    }


def parse_capstone(block):
    return {
        'title': re.sub(r'^Course \d+ Capstone:\s*', '', block[0]),
        'time': field(block, 'Time'),
        'badge': field(block, 'Completion badge'),
        'evidence': field(block, 'Evidence produced'),
        # The line after "Evidence produced" value is the summary paragraph.
        'summary': block[block.index('Evidence produced') + 2],
        'tasks': [
            re.sub(r'^\d+\.\s*', '', l)
            for l in block
            if re.match(r'^\d+\.\s', l)
        ],
        'successStandard': field(block, 'Success standard'),
    }


def main():
    lines = paragraphs(DOCX)

    # Section 5 holds the lesson plans; section 6 the capstones.
    plans = lines.index('5. Detailed Lesson Plans')
    capstones_at = lines.index('6. Four Capstone Projects')

    lesson_marks = [
        i for i in range(plans, capstones_at) if re.match(r'^Lesson \d+: ', lines[i])
    ]

    courses = []
    for course_id, heading in COURSES:
        start = lines.index(heading, plans)
        nxt = min(
            [i for i in lesson_marks if i > start] or [capstones_at],
        )
        # Lessons belonging to this course run until the next course heading.
        following = [
            lines.index(h, plans) for _, h in COURSES if lines.index(h, plans) > start
        ]
        end = min(following) if following else capstones_at
        mine = [i for i in lesson_marks if start < i < end]

        lessons = []
        for n, at in enumerate(mine, 1):
            stop = mine[n] if n < len(mine) else end
            lessons.append(parse_lesson(lines[at:stop], n))

        courses.append({'id': course_id, 'title': heading.split(': ', 1)[1], 'lessons': lessons})

    # Bound at section 7, or the last capstone swallows the numbered lists in
    # the implementation guide that follows it.
    end_of_capstones = next(
        (i for i in range(capstones_at, len(lines)) if lines[i].startswith('7. Platform')),
        len(lines),
    )
    capstone_marks = [
        i for i in range(capstones_at, end_of_capstones)
        if re.match(r'^Course \d+ Capstone: ', lines[i])
    ]
    caps = []
    for n, at in enumerate(capstone_marks):
        stop = capstone_marks[n + 1] if n + 1 < len(capstone_marks) else end_of_capstones
        caps.append(parse_capstone(lines[at:stop]))

    for course, capstone in zip(courses, caps):
        course['capstone'] = capstone

    print(json.dumps(courses, indent=2, ensure_ascii=False))


main()
