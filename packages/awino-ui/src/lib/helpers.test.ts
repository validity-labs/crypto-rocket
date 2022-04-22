import { tabA11yProps } from './helpers';

describe('formatNumber', () => {
  it('should return formatted number', () => {
    expect(tabA11yProps('tabId', 0)).toEqual({
      id: `tab-tabId-0`,
      'aria-controls': `tabpanel-tabId-0`,
    });
    expect(tabA11yProps('tabId', 1)).toEqual({
      id: `tab-tabId-1`,
      'aria-controls': `tabpanel-tabId-1`,
    });
  });
});
