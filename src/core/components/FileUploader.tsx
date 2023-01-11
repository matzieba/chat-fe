import React from 'react';
import { styled } from '@mui/system';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';

export type FileUploaderProps = {
  name: string;
  value?: File[];
  onChange: (value: File[]) => void;
  label: string;
  disabled?: boolean;
  inputProps?: {
    accept?: string;
    multiple?: boolean;
  },
  buttonRender?: (props: LoadingButtonProps) => React.ReactElement;
  buttonProps?: Omit<LoadingButtonProps, 'disabled'>;
}

const HiddenInput = styled('input')({
  display: 'none',
});

export const FileUploader: React.FC<FileUploaderProps> = ({ name, label, disabled, onChange, inputProps, buttonRender, buttonProps }) => {

  const handleFileInput = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    !disabled && onChange(e.target.files);
  }, [disabled, onChange]);

  return (
    <React.Fragment>
      <HiddenInput
        id={name}
        type="file"
        onChange={handleFileInput}
        value=""
        disabled={disabled}
        {...inputProps}
      />
      <label htmlFor={name}>
        {!!buttonRender ? buttonRender({
          ...buttonProps,
          disabled,
        }) : (
          <LoadingButton disabled={disabled} {...buttonProps} component="span">
            {label}
          </LoadingButton>
        )}
      </label>
    </React.Fragment>
  );
};
