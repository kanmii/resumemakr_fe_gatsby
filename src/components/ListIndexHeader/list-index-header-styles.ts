import styled from "styled-components/macro";
import { Card } from "semantic-ui-react";

import { withControls } from "../../styles/mixins";

export const Container = styled(Card.Content)`
  ${withControls}

  &:after {
    display: none !important;
  }
`;
