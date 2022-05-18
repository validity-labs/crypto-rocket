/* eslint-disable no-unused-vars */
import { StringSchema, StringSchemaConstructor } from 'yup';

declare module 'yup' {
  interface StringSchema {
    format(format: string): StringSchema;
  }
}

export const string: StringSchemaConstructor;
