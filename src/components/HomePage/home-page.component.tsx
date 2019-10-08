import React, { useLayoutEffect } from "react";
import { Link } from "gatsby";
import { Menu } from "semantic-ui-react";
import { NavigateFn } from "@reach/router";
import { Header } from "../Header/header.index";
import { SIGN_UP_URL, RESUMES_HOME_PATH } from "../../routing";
import { SignUp } from "../SignUp/signup.component";
import { Props, uiTexts } from "./home-page.utils";
import { getUser } from "../../state/tokens";
import { prefix as domId } from "./home-page.dom-selectors";

export function HomePage(props: Props) {
  const { navigate } = props;

  useLayoutEffect(() => {
    if (getUser()) {
      (navigate as NavigateFn)(RESUMES_HOME_PATH);
      return;
    }
  }, [navigate]);

  return (
    <div id={domId} className="app-container">
      <Header
        rightMenuItems={[
          <Menu.Item
            key="1"
            as={Link}
            to={SIGN_UP_URL}
            name={SIGN_UP_URL}
            style={{
              border: "2px solid black",
              fontWeight: "900",
            }}
          />,
        ]}
      />

      <div
        style={{
          backgroundColor: "#2b3137",
          color: "#fff",
          overflowY: "scroll",
          flex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1>{uiTexts.story.header}</h1>

          <p>
            ResumeMakr is a platform inspired by you, for your career success.
            From the new graduate to the executive, you can craft compelling
            resumes to power your career.
          </p>
        </div>

        <SignUp />
      </div>
    </div>
  );
}
