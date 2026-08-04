import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CourseDetail } from '@/components/courses/course-detail';
import { ComingSoon } from '@/components/ui/coming-soon';
import { courses, findCourse } from '@/data/courses';

interface PageProps {
  params: { courseId: string };
}

/** Pre-renders the four tracks; anything else 404s. */
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

  // A course whose lessons are not transcribed yet says so honestly rather than
  // rendering an empty mission list.
  if (course.status !== 'available' || course.lessons.length === 0) {
    return (
      <ComingSoon
        title={course.title}
        description={course.tagline}
        milestone="Milestone 3"
        highlights={course.outcomes}
      />
    );
  }

  return <CourseDetail course={course} />;
}
