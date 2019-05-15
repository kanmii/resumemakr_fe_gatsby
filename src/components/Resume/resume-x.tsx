import React from "react";
import { WindowLocation } from "@reach/router";

import "./styles.scss";
import { UpdateResumeForm } from "../UpdateResumeForm";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { ResumePathHash } from "../../routing";
import { Props } from "./resume";

export function Resume(props: Props) {
  const { header } = props;

  const location = props.location as WindowLocation;

  const hash = location.hash;

  return (
    <div className="components-resume">
      {hash.startsWith(ResumePathHash.edit) && (
        <>
          {header}

          <div className="main">
            <div className="side-bar">.</div>

            <div className="main-container">
              <UpdateResumeForm />
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
