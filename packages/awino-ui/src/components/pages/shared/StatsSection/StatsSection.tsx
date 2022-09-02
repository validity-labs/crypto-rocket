import Section from '@/components/layout/Section/Section';
import { StatsData, StatsFormatter } from '@/types/app';

import StatsItems from '../../shared/StatsItems/StatsItems';

interface Props {
  items: StatsData;
  formatters: StatsFormatter[];
}
export default function StatsSection({ items, formatters }: Props) {
  return (
    <Section>
      <StatsItems items={items} formatters={formatters} />
    </Section>
  );
}
