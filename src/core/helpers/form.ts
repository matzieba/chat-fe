import { cleanObject } from './object';

export const getFormDataFromObject = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  const cleanData = cleanObject(data);

  Object.keys(cleanData).forEach(key => {
    formData.append(key, data[key]);
  });

  return formData;
};
