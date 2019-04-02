import styled from "styled-components/macro";
import { lighten } from "polished";

import {
  AppContainer,
  visuallyHidden,
  appBgColor,
  AppMain1
} from "../../styles/mixins";

export const FormField = styled.div`
  &.error {
    color: red;
  }

  textarea,
  input {
    display: block;
    min-width: 100%;
    font-size: 1em;
    padding: 0.7em 0.5em 0.3em 0.5em;
    margin: 5px 0 5px 0;
  }
`;

const bgColor = lighten(0.026, appBgColor);

const newBtnWidth = 45;
const newBtnBottom = 20;

export const HomeContainer = styled(AppContainer)`
  ${AppMain1} {
    position: relative;
    overflow: hidden;
  }

  .no-resume {
    display: block;
    padding: 10px;
    cursor: pointer;
  }

  .new {
    position: absolute;
    right: 20px;
    bottom: ${newBtnBottom}px;
    width: ${newBtnWidth}px;
    height: ${newBtnWidth}px;
    border-radius: 50%;
    border-width: 1px;
    border-color: transparent;
    background: #09f;
    box-shadow: 0 2px 0 #007cce;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 500;
    cursor: pointer;
  }

  .main-content {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: ${newBtnWidth + newBtnBottom + 10}px;
  }

  .titles {
    max-width: 800px;
    background: #ffffff;

    & > .header {
      background-color: ${bgColor};
      padding: 10px 10px 20px 10px;
      font-size: 1.3em;
      font-weight: 700;
    }

    .row {
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid ${appBgColor};

      &:first-child {
        padding-top: 20px;
        border-bottom: none;
      }

      &:last-child {
        border-bottom: none;
      }

      &.header {
        background-color: ${bgColor};
        margin-top: 20px;
        text-transform: uppercase;
        color: blue;
        font-weight: 600;
        display: none;
      }

      .controls,
      .title {
        margin-bottom: 15px;
      }

      @media (min-width: 550px) {
        display: flex;
        justify-content: space-between;
        padding-left: 0;

        &.header {
          display: flex;

          .modified-date,
          .controls {
            position: relative;
            left: -45px;
          }
        }

        .controls,
        .title {
          margin-bottom: 0;
        }

        .title {
          order: 0;
          width: 40%;
          padding-left: 10px;
        }

        .controls {
          order: 2;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

  .deleted-resume-success {
    font-size: 0.7em;
    font-weight: 400;
    margin-top: 10px;
    margin-bottom: -15px;

    & > div {
      border: 1px solid #1e99ff;
      display: inline-block;
      padding-right: 10px;
      padding-left: 5px;
    }

    .ui.horizontal.label {
      background-color: #1e99ff !important;
      border-color: #1e99ff !important;
      cursor: pointer;
      border-radius: 0;
      position: relative;
      left: -5px;
    }
  }

  .control-label-text {
    ${visuallyHidden}
  }

  .clickable {
    cursor: pointer;
  }
`;
