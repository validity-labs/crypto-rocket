type DateDiffTuple = [string, string];
export type DateToNowDiffKeys = 'days' | 'hours' | 'minutes' | 'seconds';
type DateDiffChangeState = 0 | 1;
type DateDiffValues = Record<
  DateToNowDiffKeys,
  { value: DateDiffTuple; changed: [DateDiffChangeState, DateDiffChangeState] }
>;
export type DateToNowDiff = {
  tick: boolean;
  values: DateDiffValues;
};

const stoppedDateDiff: DateToNowDiff = {
  tick: false,
  values: {
    days: { value: ['0', '0'], changed: [0, 0] },
    hours: { value: ['0', '0'], changed: [0, 0] },
    minutes: { value: ['0', '0'], changed: [0, 0] },
    seconds: { value: ['0', '0'], changed: [0, 0] },
  },
};

const secondsInAMinute = 60 * 1000;
const secondsInAHour = 60 * secondsInAMinute;
const secondsInADay = 24 * secondsInAHour;

const format = (value: number): DateDiffTuple => value.toString().padStart(2, '0').split('') as DateDiffTuple;

const defaultDiffItemValue = { value: ['0', '0'], changed: [0, 0] };

export const getDateToNowDiff = (endDate: Date) => {
  let prevDiffValues = {
    days: defaultDiffItemValue,
    hours: defaultDiffItemValue,
    minutes: defaultDiffItemValue,
    seconds: defaultDiffItemValue,
  };

  return (): DateToNowDiff => {
    try {
      const now = new Date();
      const timeDifference = endDate.getTime() - now.getTime();

      // return inititial values with tick flag set to false, which will stop timer
      if (timeDifference < 0) {
        throw new Error('End date is reached.');
      }
      const hourDiff = timeDifference % secondsInADay;
      const minuteDiff = hourDiff % secondsInAHour;

      const days = Math.floor((timeDifference / secondsInADay) * 1);

      // current ui implementation only supports two digits output
      if (days > 99) {
        throw new Error('Days value exceeds supported limit');
      }

      const currDiffValues = {
        days: format(days),
        hours: format(Math.floor((hourDiff / secondsInAHour) * 1)),
        minutes: format(Math.floor((minuteDiff / secondsInAMinute) * 1)),
        seconds: format(Math.floor(((minuteDiff % secondsInAMinute) / 1000) * 1)),
      };

      // collect new values; each value has as changed state for each digit, which
      // takes into consideration previous changed state value
      const newValues = ['days', 'hours', 'minutes', 'seconds'].reduce((ar, r) => {
        const curr = currDiffValues[r];
        const prev = prevDiffValues[r];
        ar[r] = {
          value: curr,
          changed: [
            curr[0] !== prev.value[0] ? (prev.changed[0] === 0 ? 1 : 0) : prev.changed[0],
            curr[1] !== prev.value[1] ? (prev.changed[1] === 0 ? 1 : 0) : prev.changed[1],
          ],
        };
        return ar;
      }, {} as DateDiffValues);

      prevDiffValues = newValues;

      return { tick: true, values: newValues };
    } catch (_e) {
      // on error return values with tick set to false
      return stoppedDateDiff;
    }
  };
};
