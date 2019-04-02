import React, { useState } from "react";
import styled from "styled-components/macro";

const Behalter = styled.div`
  position: relative;

  textarea {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    resize: none;
  }

  textarea,
  div {
    padding: 10px;
    font-size: 16px;
    font-family: sans-serif;
    border: 1px solid grey;
    line-height: 1.3em;
    white-space: pre-wrap;
    box-sizing: border-box;
    margin: 0px;
  }

  div {
    word-break: break-all;
    overflow-y: hidden;
  }
`;

interface Merkmale
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  textAreaClassName?: string;
  hiddenStyles?: React.CSSProperties;
  onTextChanged?: (text: string) => void;
}

export function AutoTextarea(merkmale: Merkmale) {
  const {
    value = "",
    textAreaClassName = "",
    hiddenStyles = {},
    onTextChanged,
    ...anderes
  } = merkmale;

  const [benutzerText, einstellenBenutzerText] = useState(value);

  return (
    <Behalter>
      <textarea
        {...anderes}
        value={benutzerText}
        className={textAreaClassName}
        onChange={e => {
          const text = e.currentTarget.value;
          einstellenBenutzerText(text);

          if (onTextChanged) {
            onTextChanged(text);
          }
        }}
      />
      <div tabIndex={-1} style={hiddenStyles}>
        {benutzerText + "_"}
      </div>
    </Behalter>
  );
}

export default AutoTextarea;
