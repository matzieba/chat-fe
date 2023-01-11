import React from 'react';
import { Button, ButtonProps } from '@mui/material';

import { Dropdown, DropdownProps } from './Dropdown';


export type ButtonDropdownProps = Omit<DropdownProps, 'children'> & {
  label: React.ReactElement | string;
  buttonProps?: Omit<ButtonProps, 'endIcon'> & {
    endIcon?: (open: boolean) => React.ReactNode;
  };
}

export const ButtonDropdown: React.FC<ButtonDropdownProps> = ({ label, content, placement, buttonProps }) => (
  <Dropdown
    content={content}
    placement={placement}
  >
    {({ ref, handleToggleDropdownMenu, openDropdownMenu }) => (
      <Button
        {...buttonProps}
        ref={ref}
        onClick={handleToggleDropdownMenu}
        endIcon={buttonProps?.endIcon && buttonProps.endIcon(openDropdownMenu)}
      >
        {label}
      </Button>
    )}
  </Dropdown>
);
