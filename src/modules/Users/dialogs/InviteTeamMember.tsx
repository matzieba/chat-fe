import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { isEmailValid } from '@cvt/helpers/validation';
import { LocalizationContext } from '@cvt/contexts';

import { useUserCrud } from '../hooks/useUserCrud';


export type Form = {
  emails: string[];
}

type Props = {
  open: boolean;
  onClose: () => void;
}

export const InviteTeamMemberDialog: React.FC<Props> = ({ open, onClose }) => {

  const { dictionary } = React.useContext(LocalizationContext);
  const { inviteUser } = useUserCrud();

  const { handleSubmit, control, formState: { isSubmitting, errors }, reset } = useForm();

  const handleInputChange = React.useCallback((event: React.SyntheticEvent<Element, Event>, newInputValue: string) => {
    if (newInputValue.endsWith(',') || newInputValue.endsWith(' ')) {
      // @ts-ignore
      event.target.blur();
      // @ts-ignore
      event.target.focus();
    }
  }, []);

  const onSubmit = React.useCallback(async (data: any) => {
    await Promise.all((data?.emails || []).map((email: string) => inviteUser({ email })));
    onClose();
  }, [inviteUser, onClose]);

  React.useEffect(() => {
    reset({
      emails: [],
    });
  }, [open, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} PaperProps={{ variant: 'elevation' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle typography="h2">
          {dictionary.users.invite.dialog.title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column">
            <Grid item>
              <Controller
                name="emails"
                control={control}
                rules={{
                  required: dictionary.forms.validations.required,
                  validate: {
                    allEmailsValid: (value: string[]) => {
                      let isValid = true;
                      value.forEach(v => {
                        if (!isEmailValid(v)) {
                          isValid = false;
                        }
                      });
                      return isValid || dictionary.forms.validations.memberInvitationAllEmailsValid;
                    },
                  },
                }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    autoSelect
                    onInputChange={handleInputChange}
                    onBlur={() => {
                    }}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((email, index) => (
                        <Chip
                          deleteIcon={<Close/>}
                          label={email}
                          size="small"
                          color={isEmailValid(email) ? 'default' : 'error'}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(props) =>
                      <TextField
                        {...props}
                        autoFocus
                        size="small"
                        placeholder={dictionary.users.invite.dialog.placeholderEmail}
                        error={!!errors.emails}
                        // @ts-ignore
                        helperText={errors.emails && errors.emails.message}
                      />
                    }
                    onChange={(e, value) => field.onChange(value)}
                    options={[]}
                    defaultValue={[]}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button type="button" variant="text" onClick={onClose}>{dictionary.dialogs.buttonCancel}</Button>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained">{dictionary.users.invite.dialog.buttonInvite}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};