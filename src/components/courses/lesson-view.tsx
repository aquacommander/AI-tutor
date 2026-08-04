'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, Lightbulb, Sparkles } from 'lucide-react';
import { ActivityGameView } from '@/components/courses/activity-game';
import { LessonQuiz } from '@/components/courses/lesson-quiz';
import { LessonVideoPlayer } from '@/components/courses/lesson-video';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { findActivityGame, type ActivityGame } from '@/data/activities';
import { findBadge } from '@/data/badges';
import { findLessonVideo } from '@/data/lesson-videos';
import { useLearnerProgress, type LessonReward } from '@/hooks/use-learner-progress';
import { AGE_GROUP_LABEL, AGE_GROUP_RANGE, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { lessonTime, stageTime, videoMinutes } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import type { Course, Lesson, LessonScene, LessonVideo } from '@/types/course';

/**
 * A lesson, one step at a time.
 *
 * The first version of this page rendered all eight scenes as a single scroll of
 * prose, and it did not work: these scripts are written to be *spoken* by a
 * tutor over animation, so as an essay they are a wall of text no seven-year-old
 * will read. A child needs one idea on screen, a picture to look at, and a big
 * button to press.
 *
 * So the same content is now a journey — a handful of sentences per screen, in
 * speech bubbles, with the tutor's own pause-points as real buttons. Everything
 * written for the *grown-up* (objectives, materials, differentiation) has moved
 * out of the child's way into a panel at the bottom.
 */

/** A big friendly anchor for each scene. Real illustrations replace these. */
const SCENE_EMOJI: Record<string, string> = {
  'cold-open': '❓',
  'mission-briefing': '🎯',
  'try-before-telling': '🤔',
  'the-big-ai-idea': '💡',
  'worked-example': '🔎',
  'your-turn': '✋',
  'glitch-alert': '🐞',
  'recap-and-badge': '🏅',
};

/**
 * Splits into sentences without lookbehind — Safari below 16.4 throws a syntax
 * error on those at parse time, which would take the whole bundle down.
 */
function sentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+["'’”]*\s*/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

/**
 * Drops instructions that only make sense with a video playing.
 *
 * "Pause the video for thirty seconds" on a page with no video is exactly the
 * kind of thing that leaves a child stuck. The reveal button below *is* the
 * pause, so the instruction is carried by the interface instead of the words.
 */
function forScreen(text: string): string {
  return sentences(text)
    .filter((s) => !/\bvideo\b|countdown reaches zero|\bpause for up to\b/i.test(s))
    .join(' ');
}

/** Two sentences per bubble: enough to hold a thought, short enough to read. */
function bubbles(text: string): string[] {
  const all = sentences(forScreen(text));
  const out: string[] = [];
  for (let i = 0; i < all.length; i += 2) {
    out.push(all.slice(i, i + 2).join(' '));
  }
  return out;
}

function splitAtReveal(text: string): { prompt: string; reveal: string | null } {
  const marker = text.indexOf('Welcome back.');
  if (marker === -1) return { prompt: text, reveal: null };
  return {
    prompt: text.slice(0, marker).trim(),
    reveal: text.slice(marker + 'Welcome back.'.length).trim(),
  };
}

type Step =
  | { kind: 'plan' }
  | { kind: 'video' }
  | { kind: 'scene'; scene: LessonScene }
  | { kind: 'activity' }
  | { kind: 'mission' }
  | { kind: 'quiz' }
  | { kind: 'done' };

/**
 * The plan names what actually happens. Lessons whose film has been delivered
 * say "Watch the film"; the rest render the script as story text and say so,
 * rather than promising a video that is not there.
 */
function stageLabel(name: string, hasVideo: boolean): string {
  if (name !== 'Lesson video') return name;
  return hasVideo ? 'Watch the film' : 'Story time with Pip';
}

const STAGE_EMOJI = ['📖', '🧩', '🚀', '🧠'];

interface LessonViewProps {
  course: Course;
  lesson: Lesson;
  previous: Lesson | undefined;
  next: Lesson | undefined;
}

export function LessonView({ course, lesson, previous, next }: LessonViewProps) {
  const { learner, isLoaded, completeLesson, earnBadge } = useLearnerProgress();
  const [index, setIndex] = useState(0);
  const [reward, setReward] = useState<LessonReward | null>(null);
  const [watched, setWatched] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const alreadyDone = learner?.completedLessons.includes(`${course.id}/${lesson.id}`) ?? false;
  const ageGroup = learner?.ageGroup ?? null;
  const game = findActivityGame(course.id, lesson.id);
  const video = findLessonVideo(course.id, lesson.id);

  // Mirrors the lesson's own component table: story, guided activity,
  // independent mission, quiz. The mission gets its own screen because the
  // material gives it its own stage and its own 8-12 minutes.
  // With a film, the eight story screens become one video step — the same
  // scenes, watched instead of read, with the script still available beneath it.
  const steps: Step[] = [
    { kind: 'plan' },
    ...(video
      ? [{ kind: 'video' as const }]
      : lesson.scenes.map((scene) => ({ kind: 'scene' as const, scene }))),
    { kind: 'activity' },
    { kind: 'mission' },
    { kind: 'quiz' },
    { kind: 'done' },
  ];
  const step = steps[index];

  // Every step starts at the top. Landing halfway down a new screen is
  // disorienting for a young reader.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [index]);

  const goNext = () => setIndex((current) => Math.min(current + 1, steps.length - 1));
  const goBack = () => setIndex((current) => Math.max(current - 1, 0));

  const handlePass = (score: number) => {
    const earned = completeLesson(course.id, lesson.id);
    if (earned) {
      setReward(
        score === lesson.quiz.length
          ? { ...earned, badgeIds: [...earned.badgeIds, 'quiz-champ'] }
          : earned,
      );
      if (score === lesson.quiz.length) earnBadge('quiz-champ');
    }
    goNext();
  };

  if (!step) return null;

  return (
    <Container className="max-w-3xl space-y-6 pb-8">
      <div ref={topRef} className="scroll-mt-28" />

      {/* Where am I in the mission? */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`${ROUTES.courses}/${course.id}`}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {course.title}
          </Link>
          <p className="text-sm font-bold text-ink-muted">
            Step {index + 1} of {steps.length}
          </p>
        </div>

        <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Lesson steps">
          {steps.map((entry, position) => (
            <li key={position} className="flex-1">
              <span
                aria-current={position === index ? 'step' : undefined}
                className={cn(
                  'block h-2.5 rounded-button transition-colors duration-300',
                  position < index ? 'bg-grass' : position === index ? 'bg-primary' : 'bg-primary-light',
                )}
              >
                <span className="sr-only">
                  {stepName(entry)} — {position < index ? 'done' : position === index ? 'current' : 'to come'}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <h1 className="mt-3 font-heading text-xl font-bold sm:text-2xl">{lesson.title}</h1>
      </div>

      {step.kind === 'plan' ? (
        <PlanStep lesson={lesson} course={course} video={video} onNext={goNext} />
      ) : null}

      {step.kind === 'video' && video ? (
        <div className="space-y-4">
          <BigHeading emoji="🎬" title="Watch the mission" time={`${videoMinutes(video)} min`} />
          <LessonVideoPlayer video={video} lesson={lesson} onWatched={() => setWatched(true)} />
          <Button size="lg" onClick={goNext} className="w-full">
            {watched ? 'Finished watching — on to the activity!' : 'Skip to the activity'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {step.kind === 'scene' ? (
        <SceneStep
          key={step.scene.id}
          scene={step.scene}
          lessonImage={course.image}
          time={lesson.components[0]?.time}
          onNext={goNext}
        />
      ) : null}

      {step.kind === 'activity' ? (
        <ActivityStep lesson={lesson} game={game} onNext={goNext} />
      ) : null}

      {step.kind === 'mission' ? <MissionStep lesson={lesson} onNext={goNext} /> : null}

      {step.kind === 'quiz' ? (
        <div className="space-y-4">
          <BigHeading emoji="🧠" title="Show what you know" time={lesson.components[3]?.time} />
          <LessonQuiz questions={lesson.quiz} onPass={handlePass} alreadyPassed={alreadyDone} />
        </div>
      ) : null}

      {step.kind === 'done' ? (
        <DoneStep
          lesson={lesson}
          course={course}
          reward={reward}
          alreadyDone={alreadyDone}
          next={next}
        />
      ) : null}

      {index > 0 ? (
        <Button variant="ghost" size="md" onClick={goBack}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Go back a step
        </Button>
      ) : null}

      {/* Everything written for the adult, kept out of the child's way. */}
      <details className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
        <summary className="cursor-pointer font-heading font-bold">For grown-ups and tutors</summary>

        <div className="mt-4 space-y-5 text-sm">
          <section>
            <h2 className="font-heading font-bold">What this lesson teaches</h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold">You will need</h2>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-ink-soft">
              {lesson.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* The child plays the on-screen game; this is the same activity for
              anyone who wants to run it with real cards, away from a screen. */}
          {game ? (
            <section>
              <h2 className="font-heading font-bold">
                {lesson.activity.title} away from the screen ({lesson.activity.time})
              </h2>
              <p className="mt-1 text-ink-soft">{lesson.activity.purpose}</p>
              <ol className="mt-2 ml-5 list-decimal space-y-1 text-ink-soft">
                {lesson.activity.steps.map((stepText) => (
                  <li key={stepText}>{stepText}</li>
                ))}
              </ol>
            </section>
          ) : null}

          {isLoaded && ageGroup ? (
            <section>
              <h2 className="font-heading font-bold">
                Adapting for {AGE_GROUP_LABEL[ageGroup]}s, ages {AGE_GROUP_RANGE[ageGroup]}
              </h2>
              <p className="mt-2 text-ink-soft">{lesson.differentiation[ageGroup]}</p>
            </section>
          ) : null}

          <section>
            <h2 className="font-heading font-bold">The mistake to watch for</h2>
            <p className="mt-2 text-ink-soft">{lesson.misconception}</p>
          </section>

          <section>
            <h2 className="font-heading font-bold">What your child did</h2>
            <p className="mt-2 text-ink-soft">{lesson.parentSummary}</p>
          </section>
        </div>
      </details>

      {previous ? (
        <p className="text-sm">
          <Link
            href={`${ROUTES.courses}/${course.id}/${previous.id}`}
            className="font-bold text-primary hover:text-primary-dark"
          >
            ← Back to {previous.title}
          </Link>
        </p>
      ) : null}
    </Container>
  );
}

function stepName(step: Step): string {
  if (step.kind === 'plan') return "Today's mission";
  if (step.kind === 'video') return 'Watch the film';
  if (step.kind === 'scene') return step.scene.label;
  if (step.kind === 'activity') return 'Activity';
  if (step.kind === 'mission') return 'Your own mission';
  if (step.kind === 'quiz') return 'Quiz';
  return 'Finish';
}

function BigHeading({ emoji, title, time }: { emoji: string; title: string; time?: string }) {
  return (
    <div className="text-center">
      <span aria-hidden="true" className="block text-6xl motion-safe:animate-float sm:text-7xl">
        {emoji}
      </span>
      <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      {time ? (
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted">
          <Clock className="size-4" aria-hidden="true" />
          about {time}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The lesson's plan, straight from its component table.
 *
 * Children settle far better when they can see how long something lasts and
 * what is coming, and it is the one screen a parent can glance at to know what
 * the next forty minutes involve.
 */
function PlanStep({
  lesson,
  course,
  video,
  onNext,
}: {
  lesson: Lesson;
  course: Course;
  video: LessonVideo | undefined;
  onNext: () => void;
}) {
  return (
    <Card>
      <div className="text-center">
        <Image
          {...img(course.image)}
          alt=""
          aria-hidden="true"
          sizes="320px"
          priority
          className="mx-auto h-36 w-auto object-contain motion-safe:animate-float-slow"
        />
        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-primary">
          Mission {lesson.number} · about {lessonTime(lesson, video)}
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{lesson.title}</h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Your mission:</span> {lesson.mission}
        </p>
      </div>

      <h3 className="mt-7 text-center font-heading text-lg font-bold">Here is the plan</h3>

      <ol className="mt-4 space-y-3">
        {lesson.components.map((component, i) => (
          <li
            key={component.name}
            className="flex items-center gap-4 rounded-card border-2 border-border-soft bg-surface p-4"
          >
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-surface text-2xl"
            >
              {STAGE_EMOJI[i] ?? '✨'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-lg font-bold">
                {stageLabel(component.name, video !== undefined)}
              </span>
              <span className="block text-sm text-ink-soft">{component.purpose}</span>
            </span>
            <span className="shrink-0 rounded-button bg-sunshine-light px-3 py-1.5 text-sm font-bold text-sunshine-dark">
              {stageTime(component.name, component.time, video)}
            </span>
          </li>
        ))}
      </ol>

      <Button size="lg" onClick={onNext} className="mt-6 w-full">
        Start the mission
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}

/** A speech bubble with the character who is talking. */
function Bubble({ speaker, children }: { speaker: 'tutor' | 'glitch'; children: React.ReactNode }) {
  const isGlitch = speaker === 'glitch';

  return (
    <div className="flex items-start gap-3">
      {isGlitch ? (
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-coral/20 text-2xl"
        >
          🐞
        </span>
      ) : (
        <Image
          {...img('brand/sparky-avatar.webp')}
          alt=""
          aria-hidden="true"
          sizes="64px"
          className="size-12 shrink-0 rounded-full bg-primary-surface object-contain p-0.5"
        />
      )}

      <p
        className={cn(
          'rounded-card px-4 py-3 text-lg leading-relaxed sm:text-xl',
          isGlitch ? 'bg-coral/10 text-ink' : 'bg-primary-surface text-ink',
        )}
      >
        {isGlitch ? <span className="font-heading font-bold text-coral-dark">Glitch: </span> : null}
        {children}
      </p>
    </div>
  );
}

function SceneStep({
  scene,
  lessonImage,
  time,
  onNext,
}: {
  scene: LessonScene;
  lessonImage: Course['image'];
  time: string | undefined;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const emoji = SCENE_EMOJI[scene.id] ?? '✨';

  const first = scene.turns[0];
  const { prompt, reveal } = scene.isPause
    ? splitAtReveal(first?.text ?? '')
    : { prompt: '', reveal: null };

  return (
    <Card className="overflow-hidden">
      <BigHeading emoji={emoji} title={scene.label} time={scene.id === 'cold-open' ? time : undefined} />

      {/* One picture per screen keeps the page feeling like a storybook. */}
      {scene.id === 'cold-open' ? (
        <Image
          {...img(lessonImage)}
          alt=""
          aria-hidden="true"
          sizes="320px"
          className="mx-auto mt-4 h-36 w-auto object-contain motion-safe:animate-float-slow"
        />
      ) : null}

      <div className="mt-6 space-y-4">
        {scene.isPause ? (
          <>
            {bubbles(prompt).map((text, i) => (
              <Bubble key={i} speaker="tutor">
                {text}
              </Bubble>
            ))}

            {reveal ? (
              revealed ? (
                bubbles(reveal).map((text, i) => (
                  <Bubble key={`r${i}`} speaker="tutor">
                    {text}
                  </Bubble>
                ))
              ) : (
                <div className="rounded-card border-2 border-dashed border-primary/40 bg-primary-surface/50 p-5 text-center">
                  <p className="font-heading text-lg font-bold">Have a think first!</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Say your answer out loud, or tell someone next to you.
                  </p>
                  <Button size="lg" onClick={() => setRevealed(true)} className="mt-4">
                    <Lightbulb className="size-5" aria-hidden="true" />
                    I&rsquo;ve had a go!
                  </Button>
                </div>
              )
            ) : null}
          </>
        ) : (
          scene.turns.flatMap((turn, turnIndex) =>
            bubbles(turn.text).map((text, i) => (
              <Bubble key={`${turnIndex}-${i}`} speaker={turn.speaker}>
                {text}
              </Bubble>
            )),
          )
        )}
      </div>

      {!scene.isPause || revealed || !reveal ? (
        <Button size="lg" onClick={onNext} className="mt-6 w-full">
          Next
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      ) : null}
    </Card>
  );
}

/**
 * The guided activity, played rather than described.
 *
 * The course material writes this as a classroom task with printed cards. On
 * screen that became a list of instructions telling a child to go and find
 * twelve animal pictures, which is not an activity — it is homework. So the
 * same task is a game, and the printed-card version moves into the grown-ups
 * panel for anyone who wants to run it away from a screen.
 */
function ActivityStep({
  lesson,
  game,
  onNext,
}: {
  lesson: Lesson;
  game: ActivityGame | undefined;
  onNext: () => void;
}) {
  if (game) {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🧩" title={game.title} time={lesson.activity.time} />
        <p className="text-center text-lg text-ink-soft">{game.intro}</p>
        <ActivityGameView game={game} onFinish={onNext} />
      </div>
    );
  }

  // Lessons whose game is not built yet still get their steps, so nothing is
  // ever a dead end.
  return (
    <Card>
      <BigHeading emoji="🧩" title={lesson.activity.title} time={lesson.activity.time} />
      <p className="mt-4 text-center text-lg text-ink-soft">{lesson.activity.purpose}</p>
      <ol className="mt-6 ml-5 list-decimal space-y-2 text-lg">
        {lesson.activity.steps.map((stepText) => (
          <li key={stepText}>{stepText}</li>
        ))}
      </ol>
      <Button size="lg" onClick={onNext} className="mt-6 w-full">
        Next
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}

/**
 * The independent mission gets its own screen because the course material gives
 * it its own stage — "apply the concept without step-by-step help", 8-12
 * minutes. Tucked under the guided activity it read as an afterthought.
 */
function MissionStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const stage = lesson.components[2];

  return (
    <Card className="border-sunshine bg-sunshine-light">
      <BigHeading emoji="🚀" title="Your own mission" time={stage?.time} />

      <p className="mt-2 text-center text-sm font-semibold text-sunshine-dark">
        {stage?.purpose ?? 'Apply the concept without step-by-step help'}
      </p>

      <p className="mt-5 rounded-card bg-surface p-5 text-lg leading-relaxed">
        {lesson.independentMission}
      </p>

      <Button size="lg" onClick={onNext} className="mt-6 w-full">
        I have done it — on to the quiz!
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}

function DoneStep({
  lesson,
  course,
  reward,
  alreadyDone,
  next,
}: {
  lesson: Lesson;
  course: Course;
  reward: LessonReward | null;
  alreadyDone: boolean;
  next: Lesson | undefined;
}) {
  const badgeIds = reward?.badgeIds ?? (alreadyDone ? [lesson.badgeId] : []);
  const earned = badgeIds.map(findBadge).filter((badge) => badge !== undefined);

  return (
    <div className="space-y-5">
      <Card className="border-grass bg-grass-light text-center">
        <Image
          {...img('rewards/trophy.webp')}
          alt=""
          aria-hidden="true"
          sizes="160px"
          className="mx-auto size-28 object-contain motion-safe:animate-float"
        />
        <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
          {reward?.courseCompleted ? `You finished ${course.title}!` : 'Mission complete!'}
        </h2>
        {reward ? (
          <p className="mt-2 font-heading text-xl font-bold text-grass-dark">+{reward.xp} XP</p>
        ) : null}

        {earned.length > 0 ? (
          <ul className="mt-5 flex flex-wrap justify-center gap-3">
            {earned.map((badge) => (
              <li
                key={badge.id}
                className="flex items-center gap-2 rounded-card border-2 border-grass bg-surface px-4 py-3"
              >
                <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
                  {badge.emoji}
                </span>
                <span className="text-left">
                  <span className="block font-heading font-bold">{badge.name}</span>
                  <span className="block text-xs text-ink-muted">Badge earned</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      <Card className="bg-parchment text-center">
        <span className="text-5xl" aria-hidden="true">
          🗣️
        </span>
        <h2 className="mt-2 font-heading text-xl font-bold">Tell someone at home</h2>
        <p className="mt-2 text-lg text-ink-soft">Finish this out loud:</p>
        <p className="mt-3 font-heading text-xl font-bold">
          &ldquo;Today I discovered that AI ___.&rdquo;
        </p>
      </Card>

      {lesson.vocabulary.length > 0 ? (
        <Card>
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            New words you learned
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {lesson.vocabulary.map((word) => (
              <li
                key={word}
                className="rounded-button bg-primary-surface px-4 py-2 font-heading font-bold text-primary-dark"
              >
                {word}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {next ? (
        <ButtonLink href={`${ROUTES.courses}/${course.id}/${next.id}`} size="lg" className="w-full">
          Next mission: {next.title}
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
      ) : (
        <ButtonLink href={`${ROUTES.courses}/${course.id}`} size="lg" className="w-full">
          Back to the course
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
      )}
    </div>
  );
}
