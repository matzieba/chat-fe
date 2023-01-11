import React from 'react';
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom'; 

interface Props extends Omit<NavLinkProps, 'className'>  {
  className: string;
}

export const NavLink = React.forwardRef((props: Props, ref: React.Ref<HTMLAnchorElement>) => (
  <NavLinkBase
    ref={ref}
    {...props}
    className={({ isActive }) => isActive ? props.className + ' Mui-selected' : props.className}
  />
));
