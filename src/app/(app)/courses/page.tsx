import type { Metadata } from 'next';
import { CourseLibrary } from '@/components/courses/course-library';

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Four AI course tracks for children — twenty missions covering perception, machine learning, game design, and using AI responsibly.',
};

export default function CoursesPage() {
  return <CourseLibrary />;
}
