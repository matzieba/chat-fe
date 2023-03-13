import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import { Business, Person, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { LocalizationContext } from '@cvt/contexts';

import { UserAutocomplete, UserAutocompleteProps } from '@modules/Users/components/UserAutocomplete';


type FormCrud = Omit<Companies.Crud, 'primaryContact'> & {
  primaryContact: CVT.MaybeNull<Users.User>
};

type Field = keyof FormCrud;

interface Props {
  defaultValues?: Partial<FormCrud>;
  onSubmitRequest: (values: Companies.Crud) => void;
  onSubmitButtonText: string;
  disabledFields?: Array<Field>;
  hiddenFields?: Array<Field>;
  fieldFilters?: {
    primaryContact?: UserAutocompleteProps['filters'];
  };
}

const DEFAULT_VALUES: Partial<FormCrud> = {
  name: '',
  primaryContact: null,
};

export const CompanyForm: React.FC<Props> = ({ defaultValues = DEFAULT_VALUES, fieldFilters = {}, onSubmitRequest, onSubmitButtonText }) => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { handleSubmit, register, control, formState: { isSubmitting, errors } } = useForm<FormCrud>({
    defaultValues,
  });

  const onSubmit = React.useCallback((data: FormCrud) => {
    return onSubmitRequest({
      ...data,
      primaryContact: data.primaryContact?.id,
    });
  }, [onSubmitRequest]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('name', {
              required: dictionary.forms.validations.required,
            })}
            label={dictionary.forms.company.fieldName}
            error={!!errors.name}
            helperText={errors.name?.message as string}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Box ml={1} component={Business}/></InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="primaryContact"
            control={control}
            render={({ field }) => (
              <UserAutocomplete
                {...field}
                value={field.value || null}
                onChange={(e, value) => field.onChange(value)}
                label={dictionary.forms.company.fieldPrimaryContact}
                filters={fieldFilters.primaryContact}
                TextFieldProps={{
                  error: !!errors.primaryContact,
                  helperText: errors.primaryContact?.message,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box ml={1} component={Person}/>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Box ml="auto"/>
            <Grid item>
              <LoadingButton
                loading={isSubmitting}
                endIcon={<Save/>}
                type="submit"
                size="large"
              >
                {onSubmitButtonText}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
