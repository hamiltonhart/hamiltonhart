import React from "react";
import NavStyle, { NavItem } from "../styled/NavStyle";

const Nav = () => {
  return (
    <NavStyle>
      <NavItem to="/blog">Blog</NavItem>
    </NavStyle>
  );
};

export default Nav;
