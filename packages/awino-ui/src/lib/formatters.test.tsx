import {
  formatAmount /* , formatDate, formatDatePretty */,
  formatDateTime,
  formatNumber,
  formatGridEmptyString,
  formatGridPercent,
  formatEmptyString,
  formatPercent,
  formatGridUSD,
} from './formatters';

const stringDate = '2000-01-01T00:00:00Z';
const stringDateInvalid = '2000-99-01T00:00:00Z';
const objectDate = new Date(2001, 1, 1, 1, 1, 1);
const objectDateInvalid = new Date('Invalid Date');

jest.mock('next-i18next', () => ({
  i18n: {
    language: 'en',
    t: (key: string) => {
      if (key === 'format.date') {
        return 'yyyy-MM-dd';
      } else if (key === 'format.date-pretty') {
        return 'MMMM d, yyyy';
      } else if (key === 'format.date-time') {
        return 'yyyy-MM-dd HH:mm';
      }
      throw new Error('Only predefined keys allowed.');
    },
  },
}));

// describe('formatDate', () => {
//   it('should return formatted date', () => {
//     expect(formatDate(stringDate)).toBe('2000-01-01');
//     expect(formatDate(objectDate)).toBe('2001-02-01');
//   });

//   it('should return placeholder on invalid string', () => {
//     expect(formatDate(stringDateInvalid)).toBe('-');
//     expect(formatDate(objectDateInvalid)).toBe('-');
//   });
// });

// describe('formatDatePretty', () => {
//   it('should return formatted date', () => {
//     expect(formatDatePretty(stringDate)).toBe('January 1, 2000');
//     expect(formatDatePretty(objectDate)).toBe('February 1, 2001');
//   });

//   it('should return placeholder on invalid string', () => {
//     expect(formatDatePretty(stringDateInvalid)).toBe('-');
//     expect(formatDatePretty(objectDateInvalid)).toBe('-');
//   });
// });

describe('formatDateTime', () => {
  it('should return formatted date and time', () => {
    expect(formatDateTime(stringDate)).toBe('2000-01-01 00:00');
    expect(formatDateTime(objectDate)).toBe('2001-02-01 01:01');
  });

  it('should return placeholder on invalid string', () => {
    expect(formatDateTime(stringDateInvalid)).toBe('-');
    expect(formatDateTime(objectDateInvalid)).toBe('-');
  });
});

describe('formatNumber', () => {
  it('should return formatted number', () => {
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(100.99, 2)).toBe('100.99');
    expect(formatNumber(100.99)).toBe('101');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000.99, 2)).toBe('1,000.99');
    expect(formatNumber(0)).toBe('0');
  });

  it('should return intact value when convertion failed', () => {
    expect(formatNumber(NaN)).toBe('NaN');
    // @ts-expect-error
    expect(formatNumber('NOT_A_NUMBER')).toBe('NOT_A_NUMBER');
  });
});

describe('formatAmount', () => {
  it('should return formatted amount and currency', () => {
    expect(formatAmount(1000.99, { prefix: 'CHF' })).toBe('CHF 1,000.99');
    expect(formatAmount(10, { postfix: 'USD' })).toBe('10 USD');
    expect(formatAmount(10, { prefix: '$', postfix: 'USD' })).toBe('$ 10 USD');
  });
});

describe('formatPercent', () => {
  it('should return formatted percent', () => {
    expect(formatPercent(5)).toBe('5 %');
    expect(formatPercent(5.99)).toBe('5.99 %');
    expect(formatPercent(undefined)).toBe('0 %');
  });
});

describe('formatEmptyString', () => {
  it('should return same string or default when value is missing', () => {
    expect(formatEmptyString('lorem')).toBe('lorem');
    expect(formatEmptyString(undefined)).toBe('—');
  });
});

describe('formatGridPercent', () => {
  it('should return formatted percent', () => {
    expect(formatGridPercent({ value: 5 })).toBe('5 %');
    expect(formatGridPercent({ value: 5.99 })).toBe('5.99 %');
    expect(formatGridPercent({ value: undefined })).toBe('0 %');
  });
});

describe('formatGridEmptyString', () => {
  it('should return same string or default when value is missing', () => {
    expect(formatGridEmptyString({ value: 'lorem' })).toBe('lorem');
    expect(formatGridEmptyString({ value: undefined })).toBe('—');
  });
});

describe('formatGridUSD', () => {
  it('should return formatted amount and currency', () => {
    expect(formatGridUSD({ value: 1000.99 })).toBe('1,000.99 USD');
  });
});
