import styled from "styled-components/macro";
import { Segment } from "semantic-ui-react";

import { wrapped } from "../../styles/mixins";

const wrappedSegment = wrapped(Segment);

export const Container = styled(wrappedSegment)`
  margin-left: 15px !important;

  .segment-label {
    position: relative;
    background-color: #0099ff !important;
    border-color: #0099ff !important;

    .icon-container {
      width: 60px;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 15px;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: darken($color: #0099ff, $amount: 10);
    }

    .label-text {
      padding-left: 65px;
      display: inline-block;
    }
  }
`;
