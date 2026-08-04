#!/usr/bin/env python3
"""
Parse the curriculum .docx into JSON.

The document is a Word file whose tables become flat runs of cells in reading
order once the markup is stripped. Every lesson carries the same ten sections in
the same order, so the parse anchors on section headings and chunks the tables
by their known column count.

This is a transcription aid, not a source of truth. Its output is reviewed
against the document before it becomes app data.
"""
import html
import json
import re
import sys
import zipfile

DOCX = 'AI_for_Kids_Complete_Course_Material.docx'


def paragraphs(path):
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf8')
    xml = xml.replace('</w:p>', '\n').replace('</w:tc>', '\n')
    text = html.unescape(re.sub(r'<[^>]+>', '', xml))
    return [line.strip() for line in text.split('\n') if line.strip()]


def index_of(lines, label, start=0):
    for i in range(start, len(lines)):
        if lines[i] == label:
            return i
    raise ValueError(f'missing section: {label!r}')


def between(lines, start_label, end_label, start=0):
    a = index_of(lines, start_label, start)
    b = index_of(lines, end_label, a)
    return lines[a + 1:b]


def chunk(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]


def split_options(raw):
    """'A. OneB. TwoC. Three' -> ['One', 'Two', 'Three']"""
    parts = re.split(r'(?=[A-D]\.\s)', raw)
    return [re.sub(r'^[A-D]\.\s*', '', p).strip() for p in parts if p.strip()]


def parse_lesson(lines):
    out = {}
    out['title'] = lines[1]
    out['mission'] = lines[index_of(lines, 'Mission') + 1]

    # Fact table: label/value pairs.
    facts = {}
    i = index_of(lines, 'Core concept')
    for label in ('Core concept', 'Lesson badge', 'Total learner time', 'Video duration'):
        j = index_of(lines, label, i)
        facts[label] = lines[j + 1]
    out['concept'] = facts['Core concept']
    out['badge'] = facts['Lesson badge']
    out['learnerTime'] = facts['Total learner time']

    out['objectives'] = between(lines, 'Learning Objectives', 'Key Vocabulary')
    vocab = lines[index_of(lines, 'Key Vocabulary') + 1]
    out['vocabulary'] = [v.strip() for v in vocab.split('•') if v.strip()]
    out['materials'] = between(lines, 'Tutor Preparation and Materials', 'Component')

    # Component table: 3 columns, four stages. Carries the per-stage timings,
    # which appear nowhere else in the document.
    p = index_of(lines, 'Purpose')
    out['components'] = [
        {'name': row[0], 'time': row[1], 'purpose': row[2]}
        for row in chunk(lines[p + 1:p + 1 + 12], 3)
    ]

    # Video script: 4-column table, header then eight scenes.
    a = index_of(lines, 'Visual direction')
    scenes = chunk(lines[a + 1:a + 1 + 32], 4)
    out['scenes'] = [
        {'time': s[0], 'scene': s[1], 'narration': s[2], 'visual': s[3]} for s in scenes
    ]

    # The activity heading is the paragraph straight after the script table.
    k = a + 33
    out['activity'] = {
        'title': lines[k],
        'purpose': lines[k + 1].replace('Purpose: ', ''),
        'time': lines[k + 2].replace('Estimated time: ', ''),
        'steps': lines[k + 3:index_of(lines, 'Independent Mission', k)],
    }

    m = index_of(lines, 'Independent Mission')
    out['independentMission'] = lines[index_of(lines, 'Challenge', m) + 1]

    # Quiz: 4-column table, header then five questions.
    q = index_of(lines, 'Why')
    rows = chunk(lines[q + 1:q + 1 + 20], 4)
    out['quiz'] = [
        {
            'question': r[0],
            'options': split_options(r[1]),
            'answer': r[2],
            'explanation': r[3],
        }
        for r in rows
    ]

    d = index_of(lines, 'Ages 13–16')
    out['differentiation'] = {
        'explorer': lines[d + 1],
        'builder': lines[d + 2],
        'creator': lines[d + 3],
    }

    g = index_of(lines, 'Glitch alert', d)
    out['misconception'] = lines[g + 1]
    out['parentSummary'] = lines[index_of(lines, 'Parent or Teacher Summary') + 1]

    assets = index_of(lines, 'Video Production Asset Checklist')
    end = next(i for i in range(assets, len(lines)) if lines[i].startswith('Voice and style'))
    out['assets'] = lines[assets + 1:end]

    return out


def main():
    lines = paragraphs(DOCX)
    course = int(sys.argv[1]) if len(sys.argv) > 1 else 1

    marks = [i for i, l in enumerate(lines) if re.fullmatch(rf'Course {course} \| Lesson \d', l)]
    marks.append(next((i for i in range(marks[-1] + 1, len(lines)) if lines[i].startswith('COURSE ')), len(lines)))

    lessons = [parse_lesson(lines[marks[n]:marks[n + 1]]) for n in range(len(marks) - 1)]
    print(json.dumps(lessons, indent=2, ensure_ascii=False))


main()
