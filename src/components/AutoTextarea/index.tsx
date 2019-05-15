import React, { useState } from "react";

import "./styles.scss";

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
    <div className="components-auto-textarea">
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
    </div>
  );
}
