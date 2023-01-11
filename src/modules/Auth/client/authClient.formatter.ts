import { camelizeObject } from '@cvt/helpers/object';


export const mapUserData = (data: Users.UserApi): Users.User => {
  const user = camelizeObject<Users.User>(data);
  return {
    ...user,
    displayName: `${user.firstName} ${user.lastName}`,
  };
};

export const mapInviteData = (data: Auth.UserInviteApi): Auth.UserInvite => camelizeObject(data);
