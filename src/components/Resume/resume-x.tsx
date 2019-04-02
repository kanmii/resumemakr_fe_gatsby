import React from "react";
import { WindowLocation, NavigateFn } from "@reach/router";

import ResumeForm from "../ResumeForm";
import { Container } from "./resume-styles";
import { AppMain1 } from "../../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { ResumePathHash } from "../../routing";
import { Props } from "./resume";

export class Resume extends React.Component<Props> {
  render() {
    const { location: propsLocation, Header, navigate } = this.props;

    const location = propsLocation as WindowLocation;

    const hash = location.hash;

    const navigator = navigate as NavigateFn;

    return (
      <Container>
        {hash.startsWith(ResumePathHash.edit) && (
          <>
            <Header
              downloadFn={() => {
                // istanbul ignore next: trust @reach/router to properly inject location
                const url = (location.pathname || "") + ResumePathHash.preview;

                navigator(url);
              }}
            />

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
      </Container>
    );
  }
}

export default Resume;
