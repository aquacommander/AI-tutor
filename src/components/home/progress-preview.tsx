'use client';

import Image from 'next/image';
import { Award, Flame, Star } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ageGroups } from '@/data/age-groups';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { AGE_GROUP_LABEL, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { formatNumber } from '@/lib/utils';

export function ProgressPreview() {
  const { learner, isLoaded } = useLearnerProgress();

  // Until the store hydrates, render the guest panel. It matches the server
  // markup exactly, so there is no mismatch and nothing flashes.
  const progress = isLoaded ? learner?.progress ?? null : null;
  const ageGroup = progress?.ageGroup ?? null;
  // A learner sees their own age-group character; a visitor sees Sparky.
  const avatar =
    ageGroups.find((group) => group.id === ageGroup)?.characterImage ?? 'brand/sparky-avatar.webp';

  return (
    <section aria-labelledby="progress-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <div className="rounded-large bg-gradient-to-br from-primary-dark via-primary to-sky p-6 text-white shadow-card md:p-8">
          <h2 id="progress-heading" className="sr-only">
            Your learning journey
          </h2>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-8">
            {/* Identity + level progress */}
            <div className="flex items-center gap-4">
              <span className="inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/30">
                <Image
                  {...img(avatar)}
                  alt=""
                  aria-hidden="true"
                  sizes="80px"
                  className="size-full object-contain p-1"
                />
              </span>

              <div className="min-w-0 flex-1">
                {progress ? (
                  <>
                    <p className="font-heading text-xl font-bold">
                      Hi, {AGE_GROUP_LABEL[progress.ageGroup]}! 👋
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 rounded-button bg-sunshine px-3 py-1 text-xs font-bold text-ink">
                      <Star className="size-3.5" aria-hidden="true" />
                      Level {progress.level}
                    </p>
                    <div className="mt-3">
                      <ProgressBar
                        value={progress.currentXp}
                        max={progress.nextLevelXp}
                        tone="sunshine"
                        label={`Experience points toward level ${progress.level + 1}`}
                      />
                      <p className="mt-1.5 text-sm font-semibold text-white/90">
                        {formatNumber(progress.currentXp)} / {formatNumber(progress.nextLevelXp)} XP
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-heading text-xl font-bold">Your Learning Journey</p>
                    <p className="mt-1 text-sm text-white/90">
                      Start learning to earn XP, badges, and streaks.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <dl className="grid grid-cols-3 gap-3 rounded-card bg-white/10 p-4 md:gap-5">
              <Stat
                icon={<Star className="size-5 text-sunshine" aria-hidden="true" />}
                value={progress ? formatNumber(progress.currentXp) : '0'}
                label="XP Points"
              />
              <Stat
                icon={<Award className="size-5 text-sky-light" aria-hidden="true" />}
                value={progress ? formatNumber(progress.badgeCount) : '0'}
                label="Badges"
              />
              <Stat
                icon={<Flame className="size-5 text-coral" aria-hidden="true" />}
                value={progress ? formatNumber(progress.streakDays) : '0'}
                label="Day Streak"
              />
            </dl>

            {/* Next reward, or the entry point for a brand-new visitor */}
            {progress ? (
              <div className="rounded-card bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">Next Reward</p>
                <div className="mt-2 flex items-center gap-3">
                  <Image
                    {...img(progress.nextReward.image)}
                    alt=""
                    aria-hidden="true"
                    sizes="72px"
                    className="h-14 w-auto shrink-0 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-heading font-bold">{progress.nextReward.name}</p>
                    <ProgressBar
                      value={progress.nextReward.progress}
                      max={100}
                      tone="sunshine"
                      label={`Progress toward ${progress.nextReward.name}`}
                      className="mt-1.5 w-40"
                    />
                    <p className="mt-1 text-xs font-semibold text-white/90">
                      {progress.nextReward.progress}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ButtonLink href={ROUTES.ageSelect} variant="sunshine" size="md">
                Start earning XP
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="flex items-center justify-center gap-1.5">
          {icon}
          <span className="font-heading text-2xl font-bold">{value}</span>
        </span>
        <span aria-hidden="true" className="mt-0.5 block text-xs font-semibold text-white/80">
          {label}
        </span>
      </dd>
    </div>
  );
}
