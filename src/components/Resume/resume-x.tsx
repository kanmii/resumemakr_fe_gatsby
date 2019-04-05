import React from "react";
import { WindowLocation } from "@reach/router";

import ResumeForm from "../ResumeForm";
import { ResumeContainer } from "./resume-styles";
import { AppMain1 } from "../../styles/mixins";
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
      <ResumeContainer>
        {hash.startsWith(ResumePathHash.edit) && (
          <>
            {header}

            <AppMain1>
              <div className="side-bar">.</div>

              <div className="main-container">
                <ResumeForm />
              </div>
            </AppMain1>
          </>
        )}

        {hash.startsWith(ResumePathHash.preview) && (
          <Preview mode={PreviewMode.download} />
        )}
      </ResumeContainer>
    );
  }
}

export default Resume;
