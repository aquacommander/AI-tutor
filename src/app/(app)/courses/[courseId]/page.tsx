import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CourseDetail } from '@/components/courses/course-detail';
import { courses, findCourse } from '@/data/courses';

interface PageProps {
  params: { courseId: string };
}

/** Pre-renders the four courses; anything else 404s. */
export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const course = findCourse(params.courseId);
  if (!course) return { title: 'Course not found' };

  return { title: course.title, description: course.tagline };
}

export default function CourseDetailPage({ params }: PageProps) {
  const course = findCourse(params.courseId);
  if (!course) notFound();

  return <CourseDetail course={course} />;
}
