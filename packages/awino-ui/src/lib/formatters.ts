import { i18n } from 'next-i18next';

// import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_PRETTY_FORMAT, DEFAULT_DATE_TIME_FORMAT } from './constants';
// import dateIO from '@/dateIO';

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

// /**
//  * Format date and time to specific string format
//  * @param date - Date object or ISO string representation of date
//  * @returns
//  */
// export const formatDateTime = (date: string | Date): string => {
//   try {
//     const formatTo = i18n?.t('format.date-time', DEFAULT_DATE_TIME_FORMAT) || DEFAULT_DATE_TIME_FORMAT;
//     if (typeof date === 'string') {
//       return dateIO.formatByString(dateIO.parseISO(date), formatTo);
//     }
//     return dateIO.formatByString(date, formatTo);
//   } catch (e) {
//     return '-';
//   }
// };

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
/**
 * Format amount and currency
 *  * @param {number} amount
 *  * @param {string} [currency]
 * @returns - a formatted string
 */
export const formatAmount = (amount: number, currency: string | undefined = '$'): string => {
  return `${currency} ${formatNumber(amount, 2)}`;
};
