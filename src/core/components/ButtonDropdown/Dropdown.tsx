import React from 'react';
import { Popper, ClickAwayListener, Paper, PopperPlacementType, Fade } from '@mui/material';

type ContentProps = {
  closeDropdown: () => void;
}

export type DropdownProps = {
  content: React.ReactElement | ((props: ContentProps) => React.ReactElement);
  placement?: PopperPlacementType;
  children: (props: {
    ref: React.RefObject<HTMLButtonElement>;
    handleToggleDropdownMenu: () => void;
    openDropdownMenu: boolean;
  }) => React.ReactElement;
}

export const Dropdown: React.FC<DropdownProps> = ({ children, content, placement }) => {

  const [openDropdownMenu, setOpenDropdownMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggleDropdownMenu = React.useCallback(() => {
    setOpenDropdownMenu((prevOpen) => !prevOpen);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpenDropdownMenu(false);
  }, []);

  const handleClickOutside = React.useCallback((event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    handleClose();
  }, [handleClose]);

  return (
    <React.Fragment>
      {children({
        ref: anchorRef,
        handleToggleDropdownMenu,
        openDropdownMenu,
      })}
      <Popper
        open={openDropdownMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        placement={placement}
        style={{ zIndex: 100 }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={handleClickOutside}>
                {typeof content === 'function' ? content({ closeDropdown: handleClose }) : content}
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  );
};
