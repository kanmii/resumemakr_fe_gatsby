import React from "react";
import { WindowLocation } from "@reach/router";

import "./resume-styles.scss";
import ResumeForm from "../ResumeForm";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { ResumePathHash } from "../../routing";
import { Props } from "./resume";

export class Resume extends React.Component<Props> {
  render() {
    const { header } = this.props;

    const location = this.props.location as WindowLocation;

    const hash = location.hash;

    return (
      <div className="components-resume">
        {hash.startsWith(ResumePathHash.edit) && (
          <>
            {header}

            <div className="main">
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
}

export default Resume;
