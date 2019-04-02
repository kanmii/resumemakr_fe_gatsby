import React from "react";
import styled, { keyframes } from "styled-components/macro";

const bounce = keyframes`
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }

`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  position: relative;

  .double-bounce1,
  .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    animation: ${bounce} 2s infinite ease-in-out;
  }

  .double-bounce2 {
    animation-delay: -1s;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Loading = (props = {}) => (
  <Container>
    <Spinner {...props}>
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    </Spinner>
  </Container>
);

export default Loading;
