import { Dictionary } from '@shared/dictionary';

import { UserType } from '../enums';

export const getUserTypeLabel = (dictionary: Dictionary, value: Users.Type) => {
  const MAP = {
    [UserType.Admin]: dictionary.users.labelTypeAdmin,
    [UserType.Staff]: dictionary.users.labelTypeStaff,
    [UserType.Customer]: dictionary.users.labelTypeCustomer,
  };

  return MAP[value];
};
