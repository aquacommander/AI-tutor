import { Container } from '@/components/ui/container';
import { ageGroups } from '@/data/age-groups';
import { AgeGroupCard } from './age-group-card';

/** No top padding — the hero already ends on its own bottom spacing. */
export function AgeGroupSection() {
  return (
    <section aria-labelledby="age-groups-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <h2 id="age-groups-heading" className="sr-only">
          Choose your age group
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {ageGroups.map((group, index) => (
            <AgeGroupCard key={group.id} group={group} index={index} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
