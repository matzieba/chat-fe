export const isoRegex = new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

export const isDateString = (value: string) => isoRegex.test(value);
