import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';

export type AsyncConfirmationProps = {
  show?: boolean;
  title?: CVT.MaybeNull<React.ReactNode>;
  content?: CVT.MaybeNull<React.ReactNode>;
  confirmLabel?: CVT.MaybeNull<React.ReactNode>;
  cancelLabel?: CVT.MaybeNull<React.ReactNode>;
}

export type Props = AsyncConfirmationProps & {
  open?: boolean;
  onCancel?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const AsyncConfirmationDialog: React.FC<Props> = ({
  open = false,
  onClose = () => null,
  onCancel = () => null,
  onConfirm = () => null,
  title,
  content,
  confirmLabel,
  cancelLabel,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Typography variant="body1" align="center" mb={2}>
        {title}
      </Typography>
      <Typography variant="body2" align="center" color="error">
        {content}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Grid container justifyContent="space-between">
        {cancelLabel && (
          <Grid item>
            <Button type="button" variant="contained" color="secondary" onClick={onCancel}>{cancelLabel}</Button>
          </Grid>
        )}
        {confirmLabel && (
          <Grid item>
            <Button type="button" variant="contained" color="primary" onClick={onConfirm}>{confirmLabel}</Button>
          </Grid>
        )}
      </Grid>
    </DialogActions>
  </Dialog>
);
