import { camelCase, snakeCase } from 'lodash';
import { isDateString } from './date';

export const isObjectEmpty = (value: any) => {
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};

export const cleanObject = (obj: Record<any, any>) => {
  return Object.keys(obj).reduce<Record<string, any>>((newObj, key) => {
    if(![null, undefined, ''].includes(obj[key])) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
};

export const snakizeObject = <T>(obj: Record<string, any>): T => {
  // @ts-ignore
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [snakeCase(key)]: processObjectKeyValue(obj[key], snakizeObject),
    }),
    {},
  );
};

const processObjectKeyValue = (value: any, func: (value: any) => any): any => {

  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => processObjectKeyValue(v, func));
  }

  if (typeof value === 'object') {
    return func(value);
  }

  if (isDateString(value)) {
    return new Date(value);
  }

  return value;
};

export const camelizeObject = <T>(obj: Record<string, any>): T => {
  // @ts-ignore
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [camelCase(key)]: processObjectKeyValue(obj[key], camelizeObject),
    }),
    {},
  );
};