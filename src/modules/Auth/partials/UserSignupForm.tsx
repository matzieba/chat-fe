import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { emailRegex, passwordRegex, phoneRegex } from '@cvt/helpers/validation';
import { LocalizationContext } from '@cvt/contexts';

type FormCrud = Auth.SignupWithEmailAndPassword & { terms: boolean};

type Field = keyof FormCrud;

interface Props {
  defaultValues?: Partial<FormCrud>;
  onSubmitRequest: (values: Auth.SignupWithEmailAndPassword) => void;
  onSubmitButtonText: string;
  disabledFields?: Array<Field>;
  hiddenFields?: Array<Field>;
}

const DEFAULT_VALUES: Partial<Auth.SignupWithEmailAndPassword> = {
  firstName: '',
  lastName: '',
  // company: null,
  // jobTitle: '',
  email: '',
  userInvitationId: null,
};

export const UserSignupForm: React.FC<Props> = ({
  defaultValues = {},
  onSubmitRequest,
  onSubmitButtonText,
  hiddenFields,
  disabledFields,
}) => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { handleSubmit, control, formState: { isSubmitting, errors }, watch } = useForm<Auth.SignupWithEmailAndPassword>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
  });

  const password = watch('password');

  const isFieldVisible = React.useCallback((field: Field) => {
    if (!hiddenFields) {
      return true;
    }
    return hiddenFields.indexOf(field) === -1;
  }, [hiddenFields]);

  const isFieldEnabled = React.useCallback((field: Field) => {
    if (!disabledFields) {
      return true;
    }
    return disabledFields.indexOf(field) === -1;
  }, [disabledFields]);

  const onSubmit = React.useCallback((data: Auth.SignupWithEmailAndPassword) => {
    return onSubmitRequest(data);
  }, [onSubmitRequest]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} style={{ maxWidth: 500 }}>
        {isFieldVisible('firstName') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.user.fieldName}
                  name="firstName"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={!isFieldEnabled('firstName')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('lastName') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.user.fieldSurname}
                  name="lastName"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={!isFieldEnabled('lastName')}
                />
              )}
            />
          </Grid>
        )}
        {/* {isFieldVisible('company') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="company"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.fieldCompany}
                  name="company"
                  error={!!errors.company}
                  helperText={errors.company?.message}
                  disabled={!isFieldEnabled('company')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('jobTitle') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="jobTitle"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.user.fieldPosition}
                  name="position"
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle?.message}
                  disabled={!isFieldEnabled('jobTitle')}
                />
              )}
            />
          </Grid>
        )} */}
        {isFieldVisible('email') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: dictionary.forms.validations.required,
                pattern: {
                  value: emailRegex,
                  message: dictionary.forms.validations.invalidEmail,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.fieldEmail}
                  name="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={!isFieldEnabled('email')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('phone') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              rules={{
                pattern: {
                  value: phoneRegex,
                  message: dictionary.forms.validations.invalidPhone,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={(
                    <React.Fragment>
                      <Typography component="span" variant="inherit">{dictionary.forms.fieldPhone}</Typography>
                      <Typography component="span" variant="body2" color="gray" ml={1}>{dictionary.forms.labelOptional}</Typography>
                    </React.Fragment>
                  )}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Box ml={1} component={Phone}/></InputAdornment>,
                  }}
                  disabled={!isFieldEnabled('phone')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('password') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: dictionary.forms.validations.required,
                minLength: {
                  value: 6,
                  message: dictionary.forms.validations.minLength(6),
                },
                maxLength: {
                  value: 20,
                  message: dictionary.forms.validations.minLength(20),
                },
                pattern: {
                  value: passwordRegex,
                  message: dictionary.forms.validations.invalidPassword,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.fieldPassword}
                  name="password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={!isFieldEnabled('password')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('repeatPassword') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="repeatPassword"
              control={control}
              rules={{
                required: dictionary.forms.validations.required,
                validate: repeatPassword => repeatPassword === password || dictionary.auth.validations.passwordsDoNotMatch,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label={dictionary.forms.signup.fieldRepeatPassword}
                  name="repeatPassword"
                  type="password"
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword?.message}
                  disabled={!isFieldEnabled('repeatPassword')}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            {onSubmitButtonText}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};
