import React, { useRef } from "react";
import { WindowLocation } from "@reach/router";

import "./styles.scss";
import ResumeForm from "../ResumeForm";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { ResumePathHash } from "../../routing";
import { Props } from "./resume";
import { useSetParentClassNameOnMount } from "../hooks";

export function Resume(props: Props) {
  const { header } = props;

  const location = props.location as WindowLocation;

  const hash = location.hash;

  const componentChildRef = useRef<HTMLDivElement>(null);

  useSetParentClassNameOnMount(componentChildRef, "components-resume");

  return (
    <div className="components-resume">
      {hash.startsWith(ResumePathHash.edit) && (
        <>
          {header}

          <div className="main" ref={componentChildRef}>
            <div className="side-bar">.</div>

            <div className="main-container">
              <ResumeForm />
            </div>
          </div>
        </>
      )}

      {hash.startsWith(ResumePathHash.preview) && (
        <Preview mode={PreviewMode.download} />
      )}
    </div>
  );
}

export default Resume;
