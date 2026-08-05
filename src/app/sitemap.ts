import type { MetadataRoute } from 'next';
import { courses } from '@/data/courses';
import { stories } from '@/data/stories';
import { ROUTES } from '@/lib/constants';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Every page a search engine should know about.
 *
 * Built from the course data rather than hand-listed, so a new lesson appears
 * here the moment it is transcribed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const at = (path: string) => `${BASE}${path}`;

  const staticPages = [
    ROUTES.home,
    ROUTES.courses,
    ROUTES.stories,
    ROUTES.tutor,
    ROUTES.code,
    ROUTES.create,
    ROUTES.parents,
    ROUTES.about,
    ROUTES.privacy,
    ROUTES.ageSelect,
  ];

  const coursePages = courses.flatMap((course) => [
    at(`${ROUTES.courses}/${course.id}`),
    at(`${ROUTES.courses}/${course.id}/capstone`),
    ...course.lessons.map((lesson) => at(`${ROUTES.courses}/${course.id}/${lesson.id}`)),
  ]);

  const storyPages = stories.map((story) => at(`${ROUTES.stories}/${story.slug}`));

  return [...staticPages.map(at), ...coursePages, ...storyPages].map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: url === at(ROUTES.home) ? 1 : 0.7,
  }));
}
