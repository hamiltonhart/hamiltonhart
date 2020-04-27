import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import HeaderStyle from "../styled/HeaderStyle";
import Nav from "./nav";
import { css } from "styled-components";

const Header = ({ siteTitle }) => (
  <HeaderStyle>
    <div
      css={`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <h1>
        <Link to="/" style={{}}>
          {siteTitle}
        </Link>
      </h1>
      <Nav />
    </div>
  </HeaderStyle>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
