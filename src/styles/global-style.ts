// tslint:disable:no-var-requires

import { css, createGlobalStyle } from "styled-components";

const globalStyle = css`
  @font-face {
    font-family: "epic-outlines";
    src: url('${require("./fonts/epic-outlines/epic-outlines.eot")}');
    src: url("${require("./fonts/epic-outlines/epic-outlines.eot")}?#iefix")
        format("embedded-opentype"),
        url("${require("./fonts/epic-outlines/epic-outlines.woff")}") format("woff"),
        url("${require("./fonts/epic-outlines/epic-outlines.ttf")}") format("truetype"),
        url("${require("./fonts/epic-outlines/epic-outlines.svg")}#epic-outlines") format("svg");
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 300;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-300.woff")}")
    format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 300;
    src: url("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-300italic.woff")
      format("woff");
  }



  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 700;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-700italic.woff")}")
      format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 800;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-800.woff")}")
      format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 400;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-regular.woff")}") format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: italic;
    font-weight: 400;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-italic.woff")}") format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-600.woff")}") format("woff");
  }

  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 700;
    src: url("${require("./fonts/open-sans/open-sans-v15-latin-ext_cyrillic-ext_vietnamese_greek_greek-ext_cyrillic_latin-700.woff")}") format("woff");
  }

  html,
  body,
  #___gatsby, #___gatsby > div {
    /* we don't want any of these to scroll */
    overflow: hidden;
    height: 100%;
    width: 100%;

    /* others */
    margin: 0;
    padding: 0;
    font-family: "Open Sans", Helvetica, Arial, sans-serif;

 
  }

 

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
  }

  .ui.label,
  .ui.labels .label {
    color: white;
  }

  .visually-hidden {
    /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }
`;

export default createGlobalStyle`${globalStyle}`;
