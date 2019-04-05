import styled from "styled-components/macro";
import { Menu } from "semantic-ui-react";

import { AppContainer, wrapped, navBtn, AppMain1 } from "../../styles/mixins";

const DownloadBtnWrapped = wrapped(Menu.Item);

export const DownloadBtn = styled(DownloadBtnWrapped)`
  ${navBtn}
  color: #09f !important;
  background: #f4f4f4 !important;
  border-color: currentColor !important;
  border-width: 2px !important;
  line-height: 2rem !important;
`;

export const ResumeContainer = styled(AppContainer)`
  ${AppMain1} {
    display: flex;
  }

  .side-bar {
    width: 45px;
    min-width: 45px;
    background: #2e353e;
    color: #fff;
  }

  .main-container {
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    min-height: 100%;
    margin-left: 5px;
  }
`;
