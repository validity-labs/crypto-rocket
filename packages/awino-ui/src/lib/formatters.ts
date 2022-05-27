import { i18n } from 'next-i18next';

import BigNumber from 'bignumber.js';

import { GridValueFormatterParams } from '@mui/x-data-grid';

import { DEFAULT_DATE_TIME_FORMAT } from '@/app/constants';
import dateIO from '@/app/dateIO';
import { ethers } from 'ethers';

// import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_PRETTY_FORMAT, DEFAULT_DATE_TIME_FORMAT } from './constants';

// /**
//  * Format date to specific string format
//  * @param date - Date object or ISO string representation of date
//  * @returns
//  */
// export const formatDate = (date: string | Date): string => {
//   try {
//     const formatTo = i18n?.t('format.date', DEFAULT_DATE_FORMAT) || DEFAULT_DATE_FORMAT;
//     if (typeof date === 'string') {
//       return dateIO.formatByString(dateIO.parseISO(date), formatTo);
//     }
//     return dateIO.formatByString(date, formatTo);
//   } catch (e) {
//     return '-';
//   }
// };

// /**
//  * Format date to specific string pretty format
//  * @param date - Date object or ISO string representation of date
//  * @returns
//  */
// export const formatDatePretty = (date: string | Date): string => {
//   try {
//     const formatTo = i18n?.t('format.date-pretty', DEFAULT_DATE_PRETTY_FORMAT) || DEFAULT_DATE_PRETTY_FORMAT;
//     if (typeof date === 'string') {
//       return dateIO.formatByString(dateIO.parseISO(date), formatTo);
//     }
//     return dateIO.formatByString(date, formatTo);
//   } catch (e) {
//     return '-';
//   }
// };

/**
 * Format date and time to specific string format
 * @param date - Date object or ISO string representation of date
 * @returns
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const formatTo = i18n?.t('format.date-time', DEFAULT_DATE_TIME_FORMAT) || DEFAULT_DATE_TIME_FORMAT;
    if (typeof date === 'string') {
      return dateIO.formatByString(dateIO.parseISO(date), formatTo);
    }
    return dateIO.formatByString(date, formatTo);
  } catch (e) {
    return '-';
  }
};

/**
 * Format number using Intl API (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). On error return intact number
 *
 * There is a polyfill included in layout with this script <script src="https://polyfill.io/v3/polyfill.min.js?features=Intl.NumberFormat,Intl.NumberFormat.~locale.en,Intl.NumberFormat.~locale.de"></script>
 */
export const formatNumber = (n: number, fractionDigits: number | undefined = 0): string => {
  const language = i18n?.language;
  try {
    const newN = new Intl.NumberFormat(language, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(n);
    return newN === 'NaN' ? `${n}` : newN;
  } catch {
    // never
    return `${n}`;
  }
};

interface FormatAmountOptions {
  prefix?: string;
  postfix?: string;
}
/**
 * Format amount and currency
 *  * @param {number} amount
 *  * @param {FormatAmountOptions} [options]
 * @returns - a formatted string
 */
export const formatAmount = (amount: BigNumber | number, { prefix, postfix }: FormatAmountOptions = {}): string => {
  let n = amount;
  if (typeof n === 'number') {
    n = new BigNumber(amount);
  }
  const outputPrefix = prefix ? `${prefix} ` : '';
  const outputPostfix = postfix ? ` ${postfix}` : '';

  return `${outputPrefix}${
    n.toFormat(/* { groupSize: 3, decimalSeparator: '.', groupSeparator: ',' } */)
  }${outputPostfix}`;
};

var ranges = [
  // { divider: 1e18 , suffix: 'E' },
  // { divider: 1e15 , suffix: 'P' },
  // { divider: 1e12 , suffix: 'T' },
  // { divider: 1e9 , suffix: 'G' },
  { divider: 1e6, suffix: 'm' },
  { divider: 1e3, suffix: 'k' },
];

export const abbreviateNumber = (num: string) => {
  let n = new BigNumber(num);

  for (var i = 0; i < ranges.length; i++) {
    if (n.gte(ranges[i].divider)) {
      const suffix = ranges[i].suffix;
      BigNumber.set({ DECIMAL_PLACES: 2 });
      return { num: n.div(ranges[i].divider), suffix: i18n?.t(`format.abbreviate.number.${suffix}`) || suffix };
    }
  }
  return { num: n, suffix: '' };
};

export const formatCurrency = (amount: string, currency: string) => {
  const { num, suffix } = abbreviateNumber(amount);
  return formatAmount(num, { /* prefix: '$', */ postfix: [suffix, currency].join(' ') });
};
export const formatUSD = (amount: BigNumber | number) => formatCurrency(amount.toString(), 'USD');
export const formatAWI = (amount: string) => formatCurrency(amount, 'AWI');
export const formatFTM = (amount: string) => formatCurrency(amount, 'FTM');

/**
 * Format value to have dash as default string if value missing
 *  * @param {any} value
 * @example
 * // returns —
 * formatEmptyString({ value: undefined });
 * @returns - the same string if defined otherwise dash symbol '—'
 */
export const formatEmptyString = (value: any): string => (value ? `${value}` : '—');

/**
 * Format value as a percent string
 *  * @param {number} value
 * @example
 * // returns 5.99 %
 * formatPercent({ value: 5.99 });
 * // returns 0 %
 * formatPercent({ value: undefined });
 * @returns - a formatted string
 */
export const formatPercent = (value?: number) => `${value || 0} %`;

/*
 * DataGrid cell formatters
 */

/**
 * Format grid value as a percent string
 *  * @param {Pick<GridValueFormatterParams, 'value'>} params
 * @example
 * // returns 5.99 %
 * formatGridPercent({ value: 5.99 });
 * // returns 0 %
 * formatGridPercent({ value: undefined });
 * @returns - a formatted string
 */
export const formatGridPercent = (params: Pick<GridValueFormatterParams, 'value'>) =>
  formatPercent(params.value as number);

/**
 * Format grid value to have dash as default string if value missing
 *  * @param {Pick<GridValueFormatterParams, 'value'>} params
 * @example
 * // returns —
 * formatGridEmptyString({ value: undefined });
 * @returns - the same string if defined otherwise dash symbol '—'
 */
export const formatGridEmptyString = (params: Pick<GridValueFormatterParams, 'value'>) =>
  formatEmptyString(params.value);

export const formatGridUSD = (params: Pick<GridValueFormatterParams, 'value'>) =>
  formatUSD(new BigNumber(params.value as number));

export const formatGridDateTime = (params: Pick<GridValueFormatterParams, 'value'>) =>
  formatDateTime(params.value as Date);
