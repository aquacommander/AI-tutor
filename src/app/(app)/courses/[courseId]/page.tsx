import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui/coming-soon';
import { courseSummaries } from '@/data/courses';

interface PageProps {
  params: { courseId: string };
}

/** Pre-renders the four launch tracks; anything else 404s. */
export function generateStaticParams() {
  return courseSummaries.map((course) => ({ courseId: course.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const course = courseSummaries.find((entry) => entry.id === params.courseId);
  if (!course) return { title: 'Course not found' };

  return { title: course.title, description: course.description };
}

export default function CourseDetailPage({ params }: PageProps) {
  const course = courseSummaries.find((entry) => entry.id === params.courseId);
  if (!course) notFound();

  return (
    <ComingSoon
      title={course.title}
      description={course.description}
      milestone="Milestone 3"
      highlights={[
        `${course.lessonCount} lessons worth ${course.totalXp} XP in total`,
        'Sidebar lesson list with completion checkmarks and a progress bar',
        'Three quiz questions per lesson, each with an explanation',
        'Previous/Next navigation, ending in a "Complete Course" step',
      ]}
    />
  );
}
