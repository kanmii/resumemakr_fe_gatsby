import React from "react";
import styled, { css } from "styled-components/macro";
import { Modal, ModalProps, Label, LabelProps, Card } from "semantic-ui-react";

export function wrapped<T>(
  Component: React.ComponentClass<T> | React.FunctionComponent<T>
) {
  return function withClassNameInner(props: T) {
    return <Component {...props} />;
  };
}

export const visuallyHidden = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility  */
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
`;

export const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;

export const resetVisuallyHidden = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility  */
  position: absolute !important;
  height: initial;
  width: initial;
  overflow: visible;
  clip: initial;
`;

export const openSansMixin = css`
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
`;

export const btnMixin = css`
  transition: background 0.4s ease-in-out, border-color 0.4s ease-in-out,
    color 0.4s ease-in-out, box-shadow 0.4s ease-in-out !important;
  text-align: center !important;
  display: inline-block !important;
  white-space: nowrap !important;
  vertical-align: middle !important;
  touch-action: manipulation !important;
  cursor: pointer !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  background-image: none !important;
  text-decoration: none !important;
  font-weight: 400 !important;
  border-style: solid !important;
  border-radius: 3px !important;
  line-height: 2.25rem !important;
`;

export const ToolTip = styled.span`
  ${visuallyHidden}
  color: #ffffff;
`;

export const navBtn = css`
  ${btnMixin}
  position: relative !important;
  padding: 0 1em !important;

  /* &:focus, */
  /* &:active, */
  &:hover1 {
    ${ToolTip} {
      ${btnMixin}
      vertical-align: middle;
      left: 50%;
      top: -54px;
      transform: translateX(-50%);
      font-size: 1.2rem;
      background: #09f;
      line-height: 1.5rem;
      padding: 12px;
      border-radius: 4px;
      ${resetVisuallyHidden}

      &:before {
        position: absolute;
        left: 50%;
        bottom: -7px;
        margin-left: -10px;
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 10px;
        border-color: #09f transparent transparent transparent;
      }
    }
  }
`;

export const NavBtn = styled.a.attrs({
  tabIndex: 0,
  "aria-haspopup": "true"
})`
  ${navBtn}
`;

export const EpicBtnIcon = styled.i`
  font-family: "epic-outlines" !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-variant: normal !important;
  text-transform: none !important;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  vertical-align: middle;
  margin-right: 0.5em;
`;

export const AppMain1 = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
`;

export const BerechtigungHaupanwendung = styled(AppMain1)`
  overflow-x: hidden;
  overflow-y: auto;
`;

export const appBgColor = "#f4f4f4";

export const AppContainer = styled.div`
  background-color: ${appBgColor};
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const AppHeader = styled.div`
  flex-shrink: 0;
  height: 60px;
`;

const Modal1 = wrapped<ModalProps>(Modal);

export const AppModal = styled(Modal1)`
  &.ui.modal {
    width: 90%;
    max-width: 500px;

    & > .header {
      ${openSansMixin};
      font-weight: 500;
      padding: 1rem !important;
      background: #323942;
      color: #fff;
    }
  }
`;

const wrappedLabel = wrapped<LabelProps>(Label);
export const CircularLabel = styled(wrappedLabel).attrs({
  circular: true
})`
  position: relative !important;
  min-width: 21px !important;
  min-height: 21px !important;
  width: 21px !important;
  height: 21px !important;
  border-radius: 50% !important;
  margin-right: 10px !important;
  display: inline-flex !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .icon {
    margin: 0 0 2.8px 1px !important;
    opacity: 1;
    font-size: 0.8em !important;
  }
`;

export const withControls = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const berechtigungBreiteCss = css`
  min-width: 310px;
  width: 95% !important;
  max-width: 400px !important;
  margin: 10px auto !important;
`;

const Card1 = wrapped(Card);
export const BerechtigungKarte = styled(Card1)`
  ${berechtigungBreiteCss}
`;
