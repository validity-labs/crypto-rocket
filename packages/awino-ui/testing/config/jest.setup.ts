import { createSerializer } from '@emotion/jest';

import { I18nPageNamespace } from '@/types/app';

import '@testing-library/jest-dom';

// interface TFunctionOptions {
//   ns?: string;
// }
interface TransProps {
  i18nKey: string;
  values: Record<string, string>;
}

// const t = (k: string, options: TFunctionOptions) => {
//   console.log(k, options);
//   return `${options?.ns ? `${options.ns}:` : ''}${k}`;
// };
const getT = (ns?: I18nPageNamespace) => (k: string) => {
  return `${ns ? `${ns}:` : ''}${k}`;
};
const i18n = {
  language: 'en',
};
// const useMock = [tMock, i18nMock];
// useMock.t = tMock;
// useMock.i18n = i18nMock;

// const useTranslation = (ns: string | undefined = 'common') => ({
//   t: (key: string, options: TFunctionOptions) => {
//     return `${options?.ns || ns}:${key}`;
//   },
//   i18n: {
//     language: 'en',
//   },
// });
// Mock react i18n to prefix key with namespace
jest.mock('next-i18next', () => ({
  useTranslation: (ns?: I18nPageNamespace) => ({ t: getT(ns), i18n }),
  Trans: ({ i18nKey, values }: TransProps) => `${i18nKey}${values ? ` - ${JSON.stringify(values)}` : ''}`,
  i18n: {
    language: 'en',
    t: (key: string) => {
      if (key === 'format.date') {
        return 'yyyy-MM-dd';
      } else if (key === 'format.date-pretty') {
        return 'MMMM d, yyyy';
      } else if (key === 'format.date-time') {
        return 'yyyy-MM-dd HH:mm';
      } else if (key.startsWith('format.abbreviate.number')) {
        const parts = key.split('.');
        return parts[parts.length - 1];
      }
      throw new Error(`${key} - only predefined keys allowed.`);
    },
  },
}));

// Mock next image component to dump props as it is
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return JSON.stringify(props); //  <img { ...props } />
  },
}));

// Rename emotion serializer classname from 'emotion-' to 'css-'
// https://emotion.sh/docs/@emotion/jest#classnamereplacer
const emotionSerializer = createSerializer({
  classNameReplacer(_className, index) {
    return `css-${index}`;
  },
});

expect.addSnapshotSerializer({
  ...emotionSerializer,
  serialize: (...args) => {
    // last argument is a printer method
    const printer = (...printerArgs: unknown[]) => {
      // add marker to output string for later use
      return '__EMOTION_STYLES_MARKER__' + args[args.length - 1](...printerArgs);
    };
    // replace print method to custom version
    const customArgs = args.slice(0, -1).concat(printer);
    // get processed string
    // @ts-expect-error
    const output = emotionSerializer.serialize(...customArgs);
    // remove all emotion styles using marker
    return output.split('__EMOTION_STYLES_MARKER__')[1];
  },
});

jest.setSystemTime(new Date(2000, 0, 10, 12, 30));

// Mock react-markdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: any) => {
    return props.children; //  <img { ...props } />
  },
}));

// Mock react-markdown
jest.mock('remark-breaks', () => ({
  __esModule: true,
  default: () => {
    return; //  <img { ...props } />
  },
}));
