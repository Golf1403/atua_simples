import { StringSchema, StringSchemaConstructor } from 'yup';

declare module 'yup' {
  interface StringSchema {
    validateCpfCnpj(message: string): StringSchema;
  }
}

export let string: StringSchemaConstructor;
