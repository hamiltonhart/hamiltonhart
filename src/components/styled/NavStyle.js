import styled from "styled-components";
import { Link } from "gatsby";

const NavStyle = styled.nav`
  .desktop-nav {
    display: "flex";
    justify-content: "space-around";
  }
`;

export const NavItem = styled(Link)`
  font-size: 1.5em;
  padding: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0);
  &:hover {
    border: 1px solid var(--secondary-light);
  }
`;

export default NavStyle;
