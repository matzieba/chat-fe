import React from 'react';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { Autocomplete, Box, FormControlLabel, Grid, InputAdornment, MenuItem, MenuList, Switch, TextField, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp, Business, Group, Groups, Mail, Person, Phone, Save, Work } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { LocalizationContext } from '@cvt/contexts';
import { emailRegex, phoneRegex } from '@cvt/helpers/validation';
import { ButtonDropdown } from '@cvt/components/ButtonDropdown';

// import { useCompanies } from 'modules/Companies/hooks/useCompanies';

import { UserType } from '../enums';
import { UserContext } from '../contexts';
import { getUserTypeLabel } from '../helpers/user';
import { PictureUploader } from '../components/PictureUploader';

type FormCrud = Users.Crud;

type Fields = keyof (FormCrud & {
  submit: boolean;
});


interface Props {
    defaultValues?: Partial<FormCrud>;
    onSubmitRequest: (values: Users.Crud) => void;
    onSubmitButtonText: string;
    disabledFields?: Array<Fields>;
    hiddenFields?: Array<Fields>;
}

const DEFAULT_VALUES: Partial<Users.Crud> = {
  type: UserType.Customer,
  firstName: '',
  lastName: '',
  // company: null,
  // jobTitle: '',
  email: '',
};

export const UserForm: React.FC<Props> = ({ defaultValues = {}, onSubmitRequest, onSubmitButtonText,  disabledFields, hiddenFields }) => {

  const { isAdmin } = React.useContext(UserContext);
  const { dictionary } = React.useContext(LocalizationContext);
  // const { companies } = useCompanies({}, { enabled: isAdmin });
  const { handleSubmit, control, formState: { isSubmitting, errors }, watch, setValue } = useForm<Users.Crud>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
  });

  const isFieldDisabled = React.useCallback((field: Fields) => {
    if (!disabledFields) {
      return false;
    }
    return disabledFields.indexOf(field) !== -1;
  }, [disabledFields]);

  const isFieldVisible = React.useCallback((field: Fields) => {
    if (!hiddenFields) {
      return true;
    }
    return hiddenFields.indexOf(field) === -1;
  }, [hiddenFields]);

  const type = watch('type');

  const onSubmit = React.useCallback((data: Users.Crud) => {
    return onSubmitRequest(data);
  }, [onSubmitRequest]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {isFieldVisible('profilePicture') && (
          <Grid item xs={isFieldVisible('type') ? 8 : 12}>
            <Controller
              name="profilePicture"
              control={control}
              render={({ field }) => (
                <PictureUploader
                  {...field}
                  disabled={isFieldDisabled('profilePicture')}
                  label={dictionary.forms.user.fieldPicture}
                />
              )}
            />
          </Grid>
        )}
        {isAdmin && isFieldVisible('type') && (
          <Grid item xs={isFieldVisible('profilePicture') ? 4 : 12} display="flex" justifyContent="flex-end">
            <Box>
              <Controller
                name="type"
                control={control}
                rules={{ required: dictionary.forms.validations.required }}
                render={({ field }) => (
                  <ButtonDropdown
                    label={type ? getUserTypeLabel(dictionary, type) : dictionary.forms.user.fieldType}
                    placement="bottom-start"
                    buttonProps={{
                      variant: 'text',
                      color: 'primary',
                      startIcon: <Groups />,
                      endIcon: open => open ? <ArrowDropUp /> : <ArrowDropDown />,
                      disabled: isFieldDisabled('type'),
                    }}
                    content={({ closeDropdown }) => (
                      <MenuList>
                        {isAdmin && (
                          <MenuItem
                            value={UserType.Admin}
                            onClick={() => {
                              field.onChange(UserType.Admin);
                              closeDropdown();
                            }}
                          >
                            {dictionary.users.labelTypeAdmin}
                          </MenuItem>
                        )}
                        <MenuItem
                          value={UserType.Staff}
                          onClick={() => {
                            field.onChange(UserType.Staff);
                            closeDropdown();
                          }}
                        >
                          {dictionary.users.labelTypeStaff}
                        </MenuItem>
                        <MenuItem
                          value={UserType.Customer}
                          onClick={() => {
                            field.onChange(UserType.Customer);
                            closeDropdown();
                          }}
                        >
                          {dictionary.users.labelTypeCustomer}
                        </MenuItem>
                      </MenuList>
                    )}
                  />
                )}
              />
            </Box>
          </Grid>
        )}
        {isFieldVisible('firstName') && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={dictionary.forms.user.fieldName}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Box ml={1} component={Person}/></InputAdornment>,
                  }}
                  disabled={isFieldDisabled('firstName')}
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
                  label={dictionary.forms.user.fieldLastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Box ml={1} component={Group}/></InputAdornment>,
                  }}
                  disabled={isFieldDisabled('lastName')}
                />
              )}
            />
          </Grid>
        )}
        {/* {isFieldVisible('company') && staffView && type === UserType.Customer && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="company"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <CompanyAutocomplete
                  {...field}
                  label={dictionary.forms.fieldCompany}
                  TextFieldProps={{
                    error: !!errors.company,
                    // @ts-ignore
                    helperText: errors.company?.message,
                    InputProps: {
                      startAdornment: <InputAdornment position="start"><Box ml={1} component={Business}/></InputAdornment>,
                    },
                  }}
                  onChange={(e, value) => field.onChange(value)}
                  disabled={isFieldDisabled('company')}
                />
              )}
            />
          </Grid>
        )} */}
        {/* {isFieldVisible('jobTitle') && (
          <Grid item xs={12} sm={staffView ? 6 : 12}>
            <Controller
              name="jobTitle"
              control={control}
              rules={{ required: dictionary.forms.validations.required }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={dictionary.forms.user.fieldPosition}
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Box ml={1} component={Work}/></InputAdornment>,
                  }}
                  disabled={isFieldDisabled('jobTitle')}
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
                  label={dictionary.forms.fieldEmail}
                  error={!!errors.email}
                  helperText={!isFieldDisabled('email') && defaultValues.email ? dictionary.forms.user.fieldEmailDisabledHelper : errors.email?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Box ml={1} component={Mail}/></InputAdornment>,
                  }}
                  disabled={isFieldDisabled('email') || !!defaultValues.email}
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
                  disabled={isFieldDisabled('phone')}
                />
              )}
            />
          </Grid>
        )}
        {isFieldVisible('submit') && (
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" spacing={2}>
              <Box ml="auto"/>
              <Grid item>
                <LoadingButton
                  loading={isSubmitting}
                  endIcon={<Save/>}
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isFieldDisabled('submit')}
                >
                  {onSubmitButtonText}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
