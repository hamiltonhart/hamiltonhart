import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`


    :root {
        --primary: #262244;
        --secondary-light: #6d62c3;
        --secondary-dark: #0e0d19;
        --dark-gray: #d3d4d6;
        --light-gray: #f0f1f4;
        --text-dark: black;
        --text-light: white;
    }

    * {
        font-family: Roboto, sans-serif;
        text-decoration: none;
        margin: 0;
        :visited {
            color: inherit;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        padding: 0;
        line-spacing: 12px;
    }

    .postbody * {
        margin: 0;
        margin-bottom: 1em;
        padding: 0;
    }
    .postbody pre {
        background-color: var(--secondary-dark);
        border-radius: .5em;
        color: white;
        padding: 1em;
        margin-left: auto;
        margin-right: auto;
        overflow: scroll;
    }

    .postbody pre code {
        font-family: monospace;
        font-size: 1.2em;
    }
`;

export default GlobalStyles;
