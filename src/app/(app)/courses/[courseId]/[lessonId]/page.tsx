import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonView } from '@/components/courses/lesson-view';
import { courses, findLesson } from '@/data/courses';

interface PageProps {
  params: { courseId: string; lessonId: string };
}

/** Every lesson of every course is pre-rendered. */
export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({ courseId: course.id, lessonId: lesson.id })),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const found = findLesson(params.courseId, params.lessonId);
  if (!found) return { title: 'Lesson not found' };

  return {
    title: `${found.lesson.title} · ${found.course.title}`,
    description: found.lesson.concept.bigIdea,
  };
}

export default function LessonPage({ params }: PageProps) {
  const found = findLesson(params.courseId, params.lessonId);
  if (!found) notFound();

  return (
    // Keyed on the lesson: without it, moving between lessons keeps the step
    // index from the previous one, so a child who finished lesson 1 landed on
    // the last step of lesson 2 and never reached its film.
    <LessonView
      key={`${params.courseId}/${params.lessonId}`}
      course={found.course}
      lesson={found.lesson}
      previous={found.previous}
      next={found.next}
    />
  );
}
