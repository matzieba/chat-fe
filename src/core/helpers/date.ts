export const isoRegex = new RegExp(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

export const isDateString = (value: string) => isoRegex.test(value);
