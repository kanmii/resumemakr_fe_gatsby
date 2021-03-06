import React, { useEffect } from "react";
import { WindowLocation} from "@reach/router";
import "./resume.styles.scss";
import { UpdateResumeForm } from "../UpdateResumeForm";
import { Preview } from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview.utils";
import { ResumePathHash } from "../../routing";
import { makeSiteTitle, setDocumentTitle } from "../../constants";
import { ResumeHeader } from "./header";
import {Props} from './resume-component.types'

export function Resume(props: Props) {
  const { title } = props;

  const location = props.location as WindowLocation;

  const hash = location.hash;

  useEffect(() => {
    setDocumentTitle(makeSiteTitle(title as string));

    return setDocumentTitle;
  }, [title]);

  return (
    <div className="components-resume">
      {hash.startsWith(ResumePathHash.edit) && (
        <>
          <ResumeHeader />

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

export default Resume

