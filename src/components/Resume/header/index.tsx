import React from "react";
import { LocationContext, WindowLocation, NavigateFn } from "@reach/router";
import { Menu } from "semantic-ui-react";
import "./styles.scss";
import { withLocationHOC } from "../../with-location-hoc";
import { ResumePathHash } from "../../../routing";
import { Header } from "../../Header";
import { ToolTip } from "../../Tooltip";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const ResumeHeader: any = withLocationHOC(function ResumeHeader1(
  props: LocationContext,
) {
  const location = props.location as WindowLocation;
  const navigate = props.navigate as NavigateFn;
  const url = (location.pathname || "") + ResumePathHash.preview;

  return (
    <Header
      rightMenuItems={[
        <Menu.Item
          className="download-btn"
          key="1"
          onClick={() => navigate(url)}
        >
          <ToolTip>Download your resume</ToolTip>

          <span>Download</span>
        </Menu.Item>,
      ]}
      {...props}
    />
  );
});
