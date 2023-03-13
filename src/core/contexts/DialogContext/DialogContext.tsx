import React from 'react';

import { useQueryState } from '@cvt/hooks/useQueryState';
import { AsyncConfirmationDialog, AsyncConfirmationProps } from '@cvt/components/dialogs/AsyncConfirmationDialog';

import config from '@shared/config';

import { LocalizationContext } from '../LocalizationContext';

import { ContextProps, AsyncConfirmation } from './DialogContext.types';

const defaultContext: ContextProps = {
  openedDialogs: {},
  openDialog: () => {},
  closeDialog: () => {},
  asyncConfirmation: () => Promise.resolve(false),
  dialogOptions: {},
};

const defaultAsyncConfirmationDialog = {
  title: null,
  content: null,
  confirmLabel: null,
  cancelLabel: null,
  show: false,
};

export const DialogContext = React.createContext(defaultContext);

export const DialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  const [queryDialogs = [], setDialogs] = useQueryState<CVT.Dialogs.Dialog[]>('dialog');
  const [dialogOptions, setDialogOptions] = React.useState<Partial<Record<CVT.Dialogs.Dialog, CVT.Dialogs.Options>>>({});

  const dialogs: string[] = React.useMemo(() => {
    return typeof queryDialogs === 'string' ? [queryDialogs] : queryDialogs;
  }, [queryDialogs]);

  const openedDialogs: Record<string, boolean> = React.useMemo(() => {
    return config.dialogs.reduce((acc, curr) => ({
      ...acc,
      [curr]: dialogs.includes(curr),
    }), {});
  }, [dialogs]);

  const openDialog = React.useCallback((dialog: CVT.Dialogs.Dialog, options?: CVT.Dialogs.Options) => {
    setDialogs([...dialogs, dialog] as CVT.Dialogs.Dialog[]);
    setDialogOptions({
      ...dialogOptions,
      [dialog]: options,
    });
  }, [dialogs, setDialogs, dialogOptions]);

  const closeDialog = React.useCallback((dialog: CVT.Dialogs.Dialog) => {
    setDialogs(dialogs.filter(d => d !== dialog) as CVT.Dialogs.Dialog[]);

    const options = { ...dialogOptions };

    delete options[dialog];

    setDialogOptions(options);
  }, [dialogs, setDialogs, dialogOptions]);

  const [popup, setPopup] = React.useState<AsyncConfirmationProps>(defaultAsyncConfirmationDialog);
  const [onConfirmPopup, setOnConfirmPopup] = React.useState<() => void>(() => null);
  const [onCancelPopup, setOnCancelPopup] = React.useState<() => void>(() => null);
  const [onClosePopup, setOnClosePopup] = React.useState<() => void>(() => null);

  const asyncConfirmation: AsyncConfirmation = React.useCallback(({ title, content, confirmLabel, cancelLabel }) => {
    setPopup({
      show: true,
      title: title || dictionary.dialogs.defaultTitle,
      content: content || dictionary.dialogs.defaultContent,
      confirmLabel: confirmLabel || dictionary.dialogs.buttonYes,
      cancelLabel: cancelLabel || dictionary.dialogs.buttonNo,
    });
    return new Promise((resolve) => {
      setOnConfirmPopup(() => () => [setPopup(defaultAsyncConfirmationDialog), resolve(true)]);
      setOnCancelPopup(() => () => [setPopup(defaultAsyncConfirmationDialog), resolve(false)]);
      setOnClosePopup(() => () => [setPopup(defaultAsyncConfirmationDialog), resolve(false)]);
    });
  }, [dictionary]);

  return (
    <DialogContext.Provider
      value={{
        openedDialogs,
        openDialog,
        closeDialog,
        asyncConfirmation,
        dialogOptions,
      }}
    >
      {children}

      <AsyncConfirmationDialog
        open={popup.show}
        onClose={onClosePopup}
        onConfirm={onConfirmPopup}
        onCancel={onCancelPopup}
        title={popup.title}
        content={popup.content}
        confirmLabel={popup.confirmLabel}
        cancelLabel={popup.cancelLabel}
      />
    </DialogContext.Provider>
  );
};

export const DialogConsumer = DialogContext.Consumer;
