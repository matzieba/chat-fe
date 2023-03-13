import { AsyncConfirmationProps } from '../../components/dialogs/AsyncConfirmationDialog';

export type ContextProps = {
  openedDialogs: Partial<Record<CVT.Dialogs.Dialog, boolean>>;
  openDialog: (dialog: CVT.Dialogs.Dialog, options?: CVT.Dialogs.Options) => any;
  closeDialog: (dialog: CVT.Dialogs.Dialog) => any;
  asyncConfirmation: AsyncConfirmation;
  dialogOptions: Partial<Record<CVT.Dialogs.Dialog, CVT.Dialogs.Options>>;
};

export type AsyncConfirmation = (props: AsyncConfirmationProps) => Promise<boolean>;
