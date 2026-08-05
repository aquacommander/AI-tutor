import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CapstoneView } from '@/components/courses/capstone-view';
import { courses, findCourse } from '@/data/courses';

interface PageProps {
  params: { courseId: string };
}

export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const course = findCourse(params.courseId);
  if (!course) return { title: 'Course not found' };

  return {
    title: `${course.capstone.title} · ${course.title}`,
    description: course.capstone.summary,
  };
}

export default function CapstonePage({ params }: PageProps) {
  const course = findCourse(params.courseId);
  if (!course) notFound();

  return <CapstoneView course={course} />;
}
