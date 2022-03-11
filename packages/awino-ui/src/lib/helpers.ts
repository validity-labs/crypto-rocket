import { ID } from '@/types/app';

export function tabA11yProps(id: ID, index: number) {
  return {
    id: `tab-${id}-${index}`,
    'aria-controls': `tabpanel-${id}-${index}`,
  };
}
