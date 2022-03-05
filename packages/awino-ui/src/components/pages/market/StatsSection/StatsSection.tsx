import Section from '@/components/layout/Section/Section';
import { StatsData } from '@/types/pages/landing';

import StatsItems from '../../shared/StatsItems/StatsItems';

interface Props {
  items: StatsData;
}
export default function StatsSection({ items }: Props) {
  return (
    <Section>
      <StatsItems items={items} />
    </Section>
  );
}
