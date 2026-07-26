import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Four structured AI course tracks with lessons, quizzes, and XP rewards.',
};

export default function CoursesPage() {
  return (
    <ComingSoon
      title="AI Courses"
      description="Four course tracks — AI Ethics & Society, Data Science for Kids, Computer Vision & NLP, and Game Dev & Robotics — each with five lessons and quizzes."
      milestone="Milestone 3"
      highlights={[
        'Course library with search, difficulty filter, and topic pills',
        'Lesson viewer with code blocks, fun facts, and previous/next navigation',
        'Three quiz questions per lesson, with explanations and XP',
        'Progress bar and completion checkmarks per course',
      ]}
    />
  );
}
