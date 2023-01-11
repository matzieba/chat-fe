import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';

import { Dropdown, DropdownProps } from './Dropdown';


export type IconButtonDropdownProps = Omit<DropdownProps, 'children'> & {
  buttonProps?: IconButtonProps;
  children?: React.ReactNode;
}

export const IconButtonDropdown: React.FC<IconButtonDropdownProps> = ({ children, content, placement, buttonProps }) => (
  <Dropdown
    content={content}
    placement={placement}
  >
    {({ ref, handleToggleDropdownMenu }) => (
      <IconButton
        {...buttonProps}
        ref={ref}
        onClick={handleToggleDropdownMenu}
      >
        {children}
      </IconButton>
    )}
  </Dropdown>
);
