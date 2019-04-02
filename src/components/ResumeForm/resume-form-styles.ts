import styled from "styled-components";

import { NavBtn, EpicBtnIcon, withControls } from "../../styles/mixins";

const navBtnMaxWidth = 12.5;
const columnNavBtnMedia = `@media (max-width: ${3 * navBtnMaxWidth}rem)`;

export const Container = styled.div`
  &.container--loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  margin-right: 5px;

  form {
    width: 100%;
    padding-bottom: 3rem;

    ${columnNavBtnMedia} {
      padding-bottom: 9rem;
    }
  }

  .card {
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }

  .names {
    display: flex;
    margin-bottom: 5px;

    & > div {
      width: 48%;

      &:first-of-type {
        margin-right: 4%;
      }
    }
  }

  .with-controls {
    ${withControls}

    &.list-string-header {
      padding-bottom: 5px;
    }
  }

  .bottom-navs {
    position: fixed;
    right: 0;
    bottom: 0;
    padding: 10px;
    z-index: 1000;

    ${columnNavBtnMedia} {
      display: flex;
      flex-direction: column;

      & > a {
        max-width: ${navBtnMaxWidth}rem;
        margin-left: 0;

        & ~ a {
          margin-top: 10px;
        }
      }
    }
  }
`;

export const PreviewBtn = styled(NavBtn)`
  color: #09f !important;
  background: #f4f4f4;
  border-color: currentColor;
  border-width: 2px;
`;

export const NextBtn = styled(NavBtn)`
  color: #fff !important;
  background: #09f;
  border-color: transparent;
  box-shadow: 0 2px 0 #007cce;
  margin-left: 10px;
  border-width: 2px 2px 0 2px;
`;

export const EditBtn = styled(NavBtn)`
  color: #fff !important;
  background: #ff6d67;
  border-color: transparent;
  border-radius: 3px;
  border-width: 2px 2px 0 2px;
  box-shadow: 0 2px 0 #d75c57;
  margin-left: 10px;
`;

export const PreviewBtnIcon = styled(EpicBtnIcon)`
  &:before {
    content: "\\e28f";
  }
`;

export const PrevBtnIcon = styled(EpicBtnIcon)`
  &:before {
    content: "\\e195";
  }
`;

export const NextBtnIcon = styled(EpicBtnIcon)`
  &:before {
    content: "\\e270";
  }
`;
