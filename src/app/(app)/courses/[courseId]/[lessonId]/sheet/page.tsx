import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActivitySheet } from '@/components/courses/activity-sheet';
import { courses, findLesson } from '@/data/courses';

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({ courseId: course.id, lessonId: lesson.id })),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const found = findLesson(params.courseId, params.lessonId);
  if (!found) return { title: 'Lesson not found' };

  return {
    title: `${found.lesson.title} — printable sheet`,
    description: `Printable activity sheet and answer key for ${found.lesson.title}.`,
  };
}

export default function ActivitySheetPage({ params }: PageProps) {
  const found = findLesson(params.courseId, params.lessonId);
  if (!found) notFound();

  return <ActivitySheet course={found.course} lesson={found.lesson} />;
}
