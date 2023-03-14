import { describe, it, expect } from 'vitest';

import { isDateString, isoRegex } from './date';

describe('isDateString', () => {
  const validDateStrings = Array.from({ length: 10 }, () => {
    const year = Math.floor(Math.random() * (2022 - 2000 + 1) + 2000);
    const month = Math.floor(Math.random() * (12 - 1 + 1) + 1);
    const day = Math.floor(Math.random() * (28 - 1 + 1) + 1);
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}T12:00:00.000Z`;
  });

  const invalidDateStrings = Array.from({ length: 10 }, () => {
    const year = Math.floor(Math.random() * (2022 - 2000 + 1) + 2000);
    const month = Math.floor(Math.random() * (12 - 1 + 1) + 1);
    const day = Math.floor(Math.random() * (31 - 13 + 1) + 13);
    return `${year}-${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}T12:00:00.000Z`;
  });

  it('returns true for valid date strings', () => {
    validDateStrings.forEach((dateString) => {
      expect(isDateString(dateString)).toBe(true);
    });
  });

  it('returns false for invalid date strings', () => {
    invalidDateStrings.forEach((dateString) => {
      expect(isDateString(dateString)).toBe(false);
    });
  });

  it('returns false for a non-string value', () => {
    const dateString = 2013;
    // @ts-ignore
    expect(isDateString(dateString)).toBe(false);
  });
});

describe('isoRegex', () => {
  it('matches a valid date string', () => {
    const dateString = '2022-01-25T12:00:00.000Z';
    expect(isoRegex.test(dateString)).toBe(true);
  });

  it('does not match an invalid date string', () => {
    const dateString = '2022-25-01T12:00:00.000Z';
    expect(isoRegex.test(dateString)).toBe(false);
  });
});
