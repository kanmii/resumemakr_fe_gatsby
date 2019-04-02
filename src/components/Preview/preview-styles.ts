import styled, { css, createGlobalStyle } from "styled-components";

import { Mode } from "./preview";

export const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    overflow: auto;
    height: initial;
  }
`;

interface ContainerProps {
  mode: Mode;
}

export const Container = styled.div`
  font-family: "Arimo" !important;
  display: flex;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: normal;
  background-color: #ffffff;
  box-shadow: 0 0.5em 2.5em 0 rgba(0, 0, 0, 0.25);
  margin-top: 1.7rem !important;

  ${({ mode }: ContainerProps) =>
    mode === Mode.download &&
    css`
      margin-top: 0 !important;
      box-shadow: none;
      min-height: 100%;
      border: 1px solid #d6cdcd;
    `};

  position: relative;
  color: #292b2c;

  .experience-container {
    & + .experience-container {
      ::before {
        content: "";
        display: block;
        border: 0.6px solid #dedede;
        margin-bottom: 10px;
        margin-top: 10px;
        width: 90%;
        position: relative;
        left: 10%;
      }
    }

    .company {
      margin-bottom: 0.5rem;
    }
  }

  .main-column {
    font-family: "Arimo" !important;
    vertical-align: top;

    &.left {
      width: 25%;
      background-color: #373d48;
      color: #fff;
      padding: 3px 8px;
    }

    &.right {
      flex: 1;
      line-height: 1.5em;
      padding: 3px 10px 3px 3px;
      margin-left: 5px;
    }
  }

  .names-container {
    font-family: "Arimo" !important;
    color: #fff;
    margin-top: -0.4em;
    margin: 0;
    padding: 0;
    line-height: 1.2em;
    font-weight: 300;
  }

  .name {
    font-family: "Arimo" !important;
    font-weight: 500;
    display: block;
  }

  .profession {
    font-family: "Arimo" !important;
    margin-top: 0.2em;
  }

  .section-title {
    font-family: "Arimo" !important;
    font-style: normal;
    margin-bottom: 10px;

    &.left {
      padding: 5px 10px;
      z-index: 1;
      white-space: nowrap;
      background-color: #252932;
      vertical-align: middle;
      margin-left: -0.3em;
      margin-right: -0.4em;
      margin-top: 10px !important;
    }

    &.right {
      padding-bottom: 0.2em;
      border-top-style: solid;
      border-bottom-style: solid;
      border-top-width: 0.1em;
      border-bottom-width: 0.1em;
      border-color: #d5d6d6;
      z-index: 1;
      white-space: nowrap;
      margin-top: 35px;

      &.skills {
        margin-top: 0;
      }
    }
  }

  .section-container {
    font-family: "Arimo" !important;
    position: relative;

    &:first-of-type {
      padding-top: 0;
    }
  }

  .personal-info {
    font-family: "Arimo" !important;
    margin: 0 0 0.7em 0 !important;
    font-size: 1rem;

    & > p {
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1.7em !important;

      &:nth-child(2) {
        display: inline-block;
      }
    }

    & > .icon {
      margin-right: 10px !important;
    }
  }

  .html2pdf__page-break {
    &.preview {
      border: 1px dashed black;
      margin-left: -500px;
      margin-right: -10px;
      margin-top: 10px;
    }

    & + * {
      padding-top: 15px;
    }
  }

  .section-sub-head {
    display: flex;
    justify-content: space-around;
    align-items: baseline;
    margin-bottom: 5px;
  }

  .description {
    flex: 1;
    font-weight: 600;
  }

  .to-arrow {
    font-size: 2rem;
  }

  .achievement {
    list-style-type: disc;
    margin-left: 2em;
  }

  .has-level {
    & + .has-level {
      margin-top: 10px;
    }
  }
`;

export const Img = styled.div`
  background-image: ${({ backgroundImg }: { backgroundImg: string }) =>
    backgroundImg};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  min-height: 170px;
`;
