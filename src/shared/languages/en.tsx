export const dictionary = {
  header: {
    switchToDarkMode: 'Dark mode',
    switchToLightMode: 'Light mode',
  },

  auth: {
    login: {
      title: 'Login',

      buttonLogin: 'Login',
      buttonLoginWithGoogle: 'Login with Google',
      buttonLoginWithMicrosoft: 'Login with Microsoft',
      buttonCreateAccount: 'Create account',
      buttonResetPassword: 'Reset password',
      dontHaveAccount: 'Don\'t have an account?',
    },

    signUp: {
      title: 'Sign up',

      buttonSignup: 'Sign up',
      buttonLogin: 'Login',
      alreadyHaveAccount: 'Already have an account?',
    },

    resetPassword: {
      title: 'Reset password',

      buttonLogin: 'Login',
      buttonReset: 'Reset password',

      passwordResetEmailSent: 'Password Reset Email Sent',
    },
  
    validations: {
      userWithThisEmailAlreadyExists: 'User with this email already exists',
      userNotFound: 'User not found',
      passwordsDoNotMatch: 'Passwords do not match',
      emailOrPasswordWrong: 'Email or password wrong',
      thePasswordMustBeAtLeast8CharactersLong: 'The password must be at least 8 characters long',
    },

    impersonate: {
      noToken: 'Token is not present',
      invalidToken: 'Token is invalid or expired',
    },

    firebase: {
      errors: {
        'auth/account-exists-with-different-credential': 'This account already exists with a different login provider',
      },
    },
    divider: 'or',
  },

  users: {
    labelTypeCustomer: 'Customer',
    labelTypeAdmin: 'Admin',
    labelTypeStaff: 'Staff',
  
    invite: {
      dialog: {
        title: 'Invite team members',
        placeholderEmail: 'Email, comma separated',
        buttonInvite: 'Send invite',
        invitationSentInfo: (email: string) => `Invitation to ${email} sent`,
      },

      title: 'Team invitation',
      subtitle: (company?: string) => company ? `You've been invited to join ${company}'s team` : 'You\'ve been invited to join a team',
      buttonAcceptInvitation: 'Create account',
      inviteButton: 'Invite Team Member',
    },

    team: {
      title: 'Team',

      detailsLabel: 'Details',

      buttonInvite: 'Invite user',
    },

    create: {
      title: 'Create user',
      buttonCreate: 'Create user',
    },

    edit: {
      buttonEdit: 'Edit user',
      buttonDelete: 'Delete user',
      deleteConfirmation: 'Are you sure you want to delete this user?',
    },
  },

  menu: {
    auth: {
      login: 'Log In',
      logout: 'Log Out',
      signUp: 'Signup',
    },
    dashboard: 'Dashboard',
    user: {
      list: 'Users',
      team: 'Team',
      myAccount: 'My account',
      create: 'Create user',
    },
    freights: {
      main: 'Freights',
      list: 'Freights list',
    },
    trucks: {
      list: 'Trucks',
    },
    storages: {
      list: 'Storages',
    },
    tenders: {
      list: 'Tenders',
    },
    costsCalculator: 'Costs calculator',
  },

  forms: {
    fieldEmail: 'Email',
    fieldPhone: 'Phone',
    fieldPassword: 'Password',
    labelOptional: '(Optional)',
    buttonCreate: 'Create',
    buttonEdit: 'Save changes',
    buttonDelete: 'Delete',

    signup: {
      fieldRepeatPassword: 'Repeat Password',
    },
    user: {
      fieldName: 'Name',
      fieldLastName: 'Last name',
      fieldType: 'Type',
      fieldPosition: 'Position',
      fieldPicture: 'Upload picture',
      fieldSurname: 'Surname',
      fieldEmailDisabledHelper: 'Please contact support to change the email.',
    },

    validations: {
      required: 'This Field is Required',
      invalidDate: 'Date is Invalid',
      invalidEmail: 'Email is Invalid',
      invalidPhone: 'Phone number is Invalid',
      invalidYear: 'The year is incorrect',
      invalidPassword: 'Password is Invalid. At least 1 number is required.',
      invalidFileSize: (max: string) => `File is too big. Maximum is ${max}`,
      invalidFileType: 'File type is not valid',
      minLength: (length: number | string) => `Need to have at least ${length} characters`,
      maxLength: (length: number | string) => `Can't have more than ${length} characters`,
      oneOrMoreFieldsAreIncorrect: 'One or more fields are incorrect.',
      memberInvitationAllEmailsValid: 'One or more emails is invalid.',
    },
  },

  filters: {
    fieldSearch: 'Search',
  },

  feedback: {
    changesSaved: 'Changes saved successfully',
  },

  dialogs: {
    defaultTitle: 'Are you sure you want to do this?',
    defaultContent: 'This action is irreversible.',
    buttonNo: 'No',
    buttonYes: 'Yes',
    buttonCancel: 'Cancel',
    buttonClose: 'Close',
  },

  errors: {
    noPagePermission: 'You are not allowed to view this page',
    somethingWentWrong: 'Something went wrong!',
  },

  routes: {

  },
};

export default dictionary;
