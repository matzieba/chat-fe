import { getFormDataFromObject } from '@cvt/helpers/form';
import { camelizeObject, snakizeObject } from '@cvt/helpers/object';

export const mapUserData = (data: Users.UserApi): Users.User => {
  const user = camelizeObject<Users.User>(data);
  return {
    ...user,
    displayName: `${user.firstName} ${user.lastName}`,
  };
};

export const mapUserCrudData = (data: Users.Crud): FormData => {
  const apiData: Users.CrudApi = snakizeObject(data);

  const formData = getFormDataFromObject({
    ...apiData,
    profile_picture: typeof data.profilePicture === 'string' ? undefined : data.profilePicture,
  });

  return formData;
};

