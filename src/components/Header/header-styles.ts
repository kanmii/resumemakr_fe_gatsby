import styled from "styled-components/macro";
import { Link } from "@reach/router";

import { LogoImageQuery_file_childImageSharp_fixed } from "../../graphql/gatsby/types/LogoImageQuery";

const LogoBg = ({
  src,
  width,
  height
}: LogoImageQuery_file_childImageSharp_fixed) =>
  `
  background: url(${src}) no-repeat 0 !important;
  background-size: ${width}px ${height}px !important;
  `;

export const LogoAnchor = styled(Link)`
  ${LogoBg};
`;

export const LogoSpan = styled.span`
  ${LogoBg};
`;

export const Container = styled.div`
  flex-shrink: 0;
  background: #fff;

  & > .ui.secondary.menu {
    max-width: 1180px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.01);
    margin-left: auto;
    margin-right: auto;

    ${LogoAnchor}, ${LogoSpan} {
      height: 48px;
      width: 36px;
      overflow: hidden;
      text-align: left;
      text-indent: -119988px;
      text-transform: capitalize;
    }

    .item > .label {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #989898 !important;
      border-color: #989898 !important;

      & > .icon {
        margin: 0 !important;
      }
    }

    .dropdown .menu {
      /* font-size: 1.5em; */
      margin-top: 0;
    }
  }
`;
