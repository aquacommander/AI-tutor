'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, Eye, Lightbulb, Printer, Sparkles } from 'lucide-react';
import { ActivityGameView } from '@/components/courses/activity-game';
import { LessonQuiz } from '@/components/courses/lesson-quiz';
import { LessonVideoPlayer } from '@/components/courses/lesson-video';
import { MysteryPictureSort } from '@/components/courses/mystery-picture-sort';
import { BuildItMission } from '@/components/courses/build-it-mission';
import { EvidenceInvestigator } from '@/components/courses/evidence-investigator';
import { SoundRiddle } from '@/components/courses/sound-riddle';
import { TwoClueChallenge } from '@/components/courses/two-clue-challenge';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { findActivityGame, type ActivityGame } from '@/data/activities';
import { findBadge } from '@/data/badges';
import { findBuildMission } from '@/data/missions/build-it';
import { CHARACTERS, PIP } from '@/data/characters';
import { useLearnerProgress, type LessonReward } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { formatDuration } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import { LESSON_STAGES, type Course, type Lesson } from '@/types/course';

/**
 * A lesson, one stage at a time.
 *
 * The shape comes straight from the revised plan's standard lesson flow: a
 * curiosity hook before the film, the film, a clean concept card, a guided
 * activity, an independent mission, and a quiz. Each is its own screen, because
 * a nine-year-old needs one thing in front of them and a button to press.
 *
 * The concept card matters more than it looks. The plan found that "generated
 * text inside several scenes is misspelled, fragmented or difficult to read", so
 * the definition a child actually reads is the platform's, never the one burned
 * into the animation.
 */

type Step =
  | { kind: 'plan' }
  | { kind: 'hook' }
  | { kind: 'video' }
  | { kind: 'concept' }
  | { kind: 'activity' }
  | { kind: 'mission' }
  | { kind: 'quiz' }
  | { kind: 'done' };

const STAGE_EMOJI = ['🤔', '🎬', '💡', '🧩', '🚀', '🧠'];

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
  const [activityDone, setActivityDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const alreadyDone = learner?.completedLessons.includes(`${course.id}/${lesson.id}`) ?? false;
  const game = findActivityGame(course.id, lesson.id);

  const steps: Step[] = [
    { kind: 'plan' },
    { kind: 'hook' },
    { kind: 'video' },
    { kind: 'concept' },
    { kind: 'activity' },
    { kind: 'mission' },
    { kind: 'quiz' },
    { kind: 'done' },
  ];
  const step = steps[index];

  // Every stage starts at the top. Landing halfway down a new screen is
  // disorienting for a young reader.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [index]);

  const goNext = () => setIndex((current) => Math.min(current + 1, steps.length - 1));
  const goBack = () => setIndex((current) => Math.max(current - 1, 0));

  const handlePass = (score: number) => {
    const earned = completeLesson(course.id, lesson.id);
    if (earned) {
      const full = score === lesson.quiz.length;
      if (full) earnBadge('quiz-champ');
      setReward(full ? { ...earned, badgeIds: [...earned.badgeIds, 'quiz-champ'] } : earned);
    }
    goNext();
  };

  if (!step) return null;

  return (
    <Container className="max-w-3xl space-y-6 pb-8">
      <div ref={topRef} className="scroll-mt-28" />

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
                  {stepName(entry)} —{' '}
                  {position < index ? 'done' : position === index ? 'current' : 'to come'}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <h1 className="mt-3 font-heading text-xl font-bold sm:text-2xl">{lesson.title}</h1>
      </div>

      {step.kind === 'plan' ? <PlanStep lesson={lesson} course={course} onNext={goNext} /> : null}

      {step.kind === 'hook' ? <HookStep lesson={lesson} onNext={goNext} /> : null}

      {step.kind === 'video' ? (
        <div className="space-y-4">
          <BigHeading
            emoji="🎬"
            title="Watch the mission"
            time={formatDuration(lesson.video.durationSeconds)}
          />
          <Card className="border-primary bg-primary-surface">
            <p className="flex items-start gap-2 leading-relaxed">
              <Eye className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="font-heading font-bold">Look out for: </span>
                {lesson.watchFocus}
              </span>
            </p>
          </Card>
          {/* Keyed on the film so React builds a new <video> rather than
              re-pointing the old one. */}
          <LessonVideoPlayer
            key={lesson.video.src}
            video={lesson.video}
            title={lesson.title}
            onWatched={() => {}}
          />
          <Button size="lg" onClick={goNext} className="w-full">
            I have watched it
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {step.kind === 'concept' ? <ConceptStep lesson={lesson} onNext={goNext} /> : null}

      {step.kind === 'activity' ? (
        <ActivityStep
          lesson={lesson}
          lessonKey={`${course.id}/${lesson.id}`}
          game={game}
          onNext={() => {
            setActivityDone(true);
            goNext();
          }}
        />
      ) : null}

      {step.kind === 'mission' ? (
        <MissionStep
          lesson={lesson}
          lessonKey={`${course.id}/${lesson.id}`}
          onNext={goNext}
        />
      ) : null}

      {step.kind === 'quiz' ? (
        <div className="space-y-4">
          <BigHeading emoji="🧠" title="Show what you know" time="5–7 min" />
          {/* The plan's progress rule: "Require completion of the activity
              before unlocking the quiz." A nudge is not a requirement, so the
              quiz is genuinely not rendered until the activity is done. A child
              who has already passed this lesson keeps free access. */}
          {activityDone || alreadyDone ? (
            <LessonQuiz questions={lesson.quiz} onPass={handlePass} alreadyPassed={alreadyDone} />
          ) : (
            <Card className="border-sunshine bg-sunshine-light text-center">
              <span className="block text-5xl" aria-hidden="true">
                🔒
              </span>
              <h3 className="mt-3 font-heading text-xl font-bold">Finish the activity first</h3>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-soft">
                The quiz asks about the things you discover while playing, so it unlocks once the
                activity is done.
              </p>
              <Button size="lg" onClick={goBack} className="mt-4">
                <ArrowLeft className="size-5" aria-hidden="true" />
                Back to the activity
              </Button>
            </Card>
          )}
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

      <GrownUpPanel lesson={lesson} courseId={course.id} game={game !== undefined} />

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
  const names: Record<Step['kind'], string> = {
    plan: "Today's mission",
    hook: 'Think first',
    video: 'Watch the film',
    concept: 'The big idea',
    activity: 'Activity',
    mission: 'Your own mission',
    quiz: 'Quiz',
    done: 'Finish',
  };
  return names[step.kind];
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

function PlanStep({
  lesson,
  course,
  onNext,
}: {
  lesson: Lesson;
  course: Course;
  onNext: () => void;
}) {
  return (
    <Card>
      <div className="text-center">
        <Image
          {...img(lesson.video.poster)}
          alt=""
          aria-hidden="true"
          sizes="(max-width: 640px) 90vw, 480px"
          priority
          className="mx-auto w-full max-w-sm rounded-card object-cover"
        />
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-primary">
          Mission {lesson.number} of {course.lessons.length} · about {lesson.learnerTime}
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{lesson.title}</h2>
      </div>

      <div className="mt-7">
        <h3 className="text-center font-heading text-lg font-bold">Who you will meet</h3>
        <ul className="mt-3 flex flex-wrap justify-center gap-3">
          {[CHARACTERS.tutor, PIP, CHARACTERS.glitch].map((character) => (
            <li
              key={character.name}
              className="flex items-center gap-2 rounded-button border-2 border-border-soft bg-surface py-1.5 pl-1.5 pr-4"
            >
              <Image
                {...img(character.avatar)}
                alt=""
                aria-hidden="true"
                sizes="56px"
                className="size-10 rounded-full bg-primary-surface object-cover"
              />
              <span className="font-heading font-bold">{character.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <h3 className="mt-7 text-center font-heading text-lg font-bold">Here is the plan</h3>
      <ol className="mt-4 space-y-3">
        {LESSON_STAGES.map((stage, i) => (
          <li
            key={stage.name}
            className="flex items-center gap-4 rounded-card border-2 border-border-soft bg-surface p-4"
          >
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-surface text-2xl"
            >
              {STAGE_EMOJI[i] ?? '✨'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-lg font-bold">{stage.name}</span>
              <span className="block text-sm text-ink-soft">{stage.purpose}</span>
            </span>
            <span className="shrink-0 rounded-button bg-sunshine-light px-3 py-1.5 text-sm font-bold text-sunshine-dark">
              {stage.name === 'Watch the mission'
                ? formatDuration(lesson.video.durationSeconds)
                : stage.minutes}
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

/**
 * The curiosity hook, before the film.
 *
 * The plan puts this first for a reason — "Do not define image classification
 * yet." A child who has already had a guess watches the film looking for an
 * answer rather than waiting to be told one.
 */
function HookStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [ready, setReady] = useState(false);

  return (
    <Card className="border-primary bg-primary-surface">
      <BigHeading emoji="🤔" title="Think first" time="2–3 min" />

      <p className="mt-5 text-lg leading-relaxed sm:text-xl">{lesson.hook}</p>

      {ready ? (
        <div className="mt-6 rounded-card bg-surface p-5 text-center">
          <p className="font-heading text-lg font-bold">Keep your answer in mind.</p>
          <p className="mt-1 text-ink-soft">
            Now watch the film and see whether you were on the right track.
          </p>
          <Button size="lg" onClick={onNext} className="mt-4 w-full">
            Watch the mission
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-card border-2 border-dashed border-primary/40 bg-surface/60 p-5 text-center">
          <p className="text-ink-soft">Say your answer out loud, or tell someone next to you.</p>
          <Button size="lg" onClick={() => setReady(true)} className="mt-4">
            <Lightbulb className="size-5" aria-hidden="true" />
            I&rsquo;ve had a go!
          </Button>
        </div>
      )}
    </Card>
  );
}

/**
 * The clean concept card.
 *
 * This is the plan's fix for the unreadable text inside the animations: the same
 * idea, in the platform's own words, immediately after the film.
 */
function ConceptStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  return (
    <Card>
      <BigHeading emoji="💡" title="The big idea" time="3–4 min" />

      <p className="mt-5 rounded-card bg-primary-surface p-5 text-center font-heading text-xl font-bold leading-relaxed sm:text-2xl">
        {lesson.concept.bigIdea}
      </p>

      <h3 className="mt-6 flex items-center gap-2 font-heading text-lg font-bold">
        <Sparkles className="size-5 text-primary" aria-hidden="true" />
        Words to know
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {lesson.concept.vocabulary.map((word) => (
          <li
            key={word}
            className="rounded-button bg-primary-surface px-4 py-2 font-heading font-bold text-primary-dark"
          >
            {word}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 font-heading text-lg font-bold">By the end you can</h3>
      <ul className="mt-3 space-y-2">
        {lesson.concept.objectives.map((objective) => (
          <li key={objective} className="flex gap-2 text-lg leading-relaxed">
            <Check className="mt-1.5 size-5 shrink-0 text-grass-dark" aria-hidden="true" />
            {objective}
          </li>
        ))}
      </ul>

      <Button size="lg" onClick={onNext} className="mt-6 w-full">
        Got it — let&rsquo;s play
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}

function ActivityStep({
  lesson,
  lessonKey,
  game,
  onNext,
}: {
  lesson: Lesson;
  lessonKey: string;
  game: ActivityGame | undefined;
  onNext: () => void;
}) {
  // Lesson 1's activity has its own two-part shape — category, then evidence —
  // so it gets a bespoke component rather than the shared round engine.
  if (lessonKey === 'ai-detective-academy/picture-clue-patrol') {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🧩" title="Mystery Picture Sort" time="12–15 min" />
        <p className="text-center text-lg text-ink-soft">
          Eight pictures have arrived at the Pixel Pet Shelter. Sort each one — and say which two
          clues helped you decide. The shelter only takes <strong>real</strong> animals.
        </p>
        <MysteryPictureSort lessonKey={lessonKey} onFinish={onNext} />
      </div>
    );
  }

  if (game) {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🧩" title={game.title} time="12–15 min" />
        <p className="text-center text-lg text-ink-soft">{game.intro}</p>
        <ActivityGameView game={game} onFinish={onNext} />
      </div>
    );
  }

  // Lessons whose game is not built yet still get their steps, so nothing is
  // ever a dead end.
  return (
    <Card>
      <BigHeading emoji="🧩" title={lesson.activity.title} time="12–15 min" />
      <ol className="mt-6 ml-5 list-decimal space-y-2 text-lg">
        {lesson.activity.steps.map((stepText) => (
          <li key={stepText}>{stepText}</li>
        ))}
      </ol>
      <Button size="lg" onClick={onNext} className="mt-6 w-full">
        Done
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}

function MissionStep({
  lesson,
  lessonKey,
  onNext,
}: {
  lesson: Lesson;
  lessonKey: string;
  onNext: () => void;
}) {
  // Lesson 1's independent mission is playable: three random pictures, name the
  // animal, then justify it with two clues.
  if (lessonKey === 'ai-detective-academy/picture-clue-patrol') {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🚀" title="Two-Clue Animal Challenge" time="5–8 min" />
        <p className="text-center text-lg text-ink-soft">
          Three pictures, on your own this time. Name the animal — then say which{' '}
          <strong>two clues</strong> made you sure.
        </p>
        <TwoClueChallenge lessonKey={lessonKey} onFinish={onNext} />
      </div>
    );
  }

  if (lessonKey === 'ai-detective-academy/creative-clues') {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🕵️" title="AI Evidence Investigator" time="5–8 min" />
        <p className="text-center text-lg text-ink-soft">
          Six mystery items. Say what you notice — then make the <strong>most careful</strong> claim
          the evidence supports.
        </p>
        <EvidenceInvestigator lessonKey={lessonKey} onFinish={onNext} />
      </div>
    );
  }

  const build = findBuildMission(lessonKey);
  if (build) {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🚀" title={build.title} time="5–8 min" />
        <p className="text-center text-lg text-ink-soft">{build.intro}</p>
        <BuildItMission mission={build} lessonKey={lessonKey} onFinish={onNext} />
      </div>
    );
  }

  if (lessonKey === 'ai-detective-academy/sound-safari') {
    return (
      <div className="space-y-4">
        <BigHeading emoji="🎧" title="Sound Riddle Challenge" time="5–8 min" />
        <p className="text-center text-lg text-ink-soft">
          Six mystery sounds. Describe each one — how high, its rhythm, how loud — and{' '}
          <strong>then</strong> guess what made it.
        </p>
        <SoundRiddle lessonKey={lessonKey} onFinish={onNext} />
      </div>
    );
  }

  return (
    <Card className="border-sunshine bg-sunshine-light">
      <BigHeading emoji="🚀" title="Your own mission" time="5–8 min" />
      <p className="mt-2 text-center text-sm font-semibold text-sunshine-dark">
        Make something without step-by-step help.
      </p>
      <p className="mt-5 rounded-card bg-surface p-5 text-lg leading-relaxed">
        {lesson.childMission}
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
        <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Mission complete!</h2>
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

      {next ? (
        <ButtonLink href={`${ROUTES.courses}/${course.id}/${next.id}`} size="lg" className="w-full">
          Next mission: {next.title}
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
      ) : (
        <ButtonLink
          href={`${ROUTES.courses}/${course.id}/capstone`}
          size="lg"
          className="w-full"
        >
          Last one! On to the {course.capstone.title}
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
      )}
    </div>
  );
}

/** Everything written for the adult, kept out of the child's way. */
function GrownUpPanel({
  lesson,
  courseId,
  game,
}: {
  lesson: Lesson;
  courseId: string;
  game: boolean;
}) {
  return (
    <details className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
      <summary className="cursor-pointer font-heading font-bold">For grown-ups and tutors</summary>

      <div className="mt-4 space-y-5 text-sm">
        <section>
          <Link
            href={`${ROUTES.courses}/${courseId}/${lesson.id}/sheet`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-button bg-primary px-4 font-bold text-white"
          >
            <Printer className="size-4" aria-hidden="true" />
            Printable activity sheet and answer key
          </Link>
        </section>

        <section>
          <h2 className="font-heading font-bold">What this lesson teaches</h2>
          <ul className="mt-2 space-y-1.5">
            {lesson.concept.objectives.map((objective) => (
              <li key={objective} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading font-bold">Adapting for other ages</h2>
          <p className="mt-2 text-ink-soft">
            <Badge tone="green">Ages 6–8</Badge> {lesson.adaptation.younger}
          </p>
          <p className="mt-2 text-ink-soft">
            <Badge tone="purple">Ages 13–16</Badge> {lesson.adaptation.older}
          </p>
        </section>

        {game ? (
          <section>
            <h2 className="font-heading font-bold">
              {lesson.activity.title} away from the screen
            </h2>
            <ol className="mt-2 ml-5 list-decimal space-y-1 text-ink-soft">
              {lesson.activity.steps.map((stepText) => (
                <li key={stepText}>{stepText}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <section>
          <h2 className="font-heading font-bold">Independent mission, as written for you</h2>
          <p className="mt-2 text-ink-soft">{lesson.independentMission}</p>
        </section>

        <section>
          <h2 className="font-heading font-bold">What your child did</h2>
          <p className="mt-2 text-ink-soft">{lesson.parentTakeaway}</p>
        </section>
      </div>
    </details>
  );
}
