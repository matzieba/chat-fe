import React from 'react';
import { Alert, AlertProps, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material';
import { LocalizationContext } from '../LocalizationContext';


type FeedbackOptions = Omit<SnackbarProps, 'open'> & Pick<AlertProps, 'severity'>;

type FeedbackState = FeedbackOptions & {
  open: boolean;
};

type FeedbackContextValue = {
  triggerFeedback: (options: FeedbackOptions) => void;
  genericErrorFeedback: () => void;
};

const defaultContext: FeedbackContextValue = {
  triggerFeedback: () => {},
  genericErrorFeedback: () => {},
};

const defaultFeedbackOptions: FeedbackOptions = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
};

export const FeedbackContext = React.createContext(defaultContext);

export const FeedbackProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

  const { dictionary } = React.useContext(LocalizationContext);

  const [feedbackState, setFeedbackState] = React.useState<FeedbackState>({
    ...defaultFeedbackOptions,
    open: false,
  });

  const closeFeedback = React.useCallback(() => {
    setFeedbackState({
      ...feedbackState,
      ...defaultFeedbackOptions,
      open: false,
    });
  }, [feedbackState]);

  const triggerFeedback = React.useCallback((options: FeedbackOptions) => {
    setFeedbackState({
      ...defaultFeedbackOptions,
      ...options,
      open: true,
    });
  }, []);

  const genericErrorFeedback = React.useCallback(() => {
    triggerFeedback({
      message: dictionary.errors.somethingWentWrong,
      severity: 'error',
    });
  }, [triggerFeedback, dictionary]);

  return (
    <FeedbackContext.Provider
      value={{
        triggerFeedback,
        genericErrorFeedback,
      }}
    >
      {children}
      <MuiSnackbar {...feedbackState} onClose={closeFeedback} sx={{ paddingTop: 6.5 }}>
        <Alert onClose={closeFeedback} severity={feedbackState.severity}>
          {feedbackState.message}
        </Alert>
      </MuiSnackbar>
    </FeedbackContext.Provider>
  );
};

export const FeedbackConsumer = FeedbackContext.Consumer;
