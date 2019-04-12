import React, { useEffect } from "react";
import { Link } from "gatsby";
import { Menu } from "semantic-ui-react";
import { NavigateFn } from "@reach/router";

import Layout from "../Layout";
import Header from "../Header";
import { SIGN_UP_URL, RESUMES_HOME_PATH } from "../../routing";
import SignUp from "../SignUp";
import { Props, uiTexts } from "./home-page";

export function HomePage(props: Props) {
  const { user } = props;

  useEffect(() => {
    if (user) {
      (props.navigate as NavigateFn)(RESUMES_HOME_PATH);
      return;
    }
  }, [user]);

  return (
    <Layout>
      <div className="app-container">
        <Header
          rightMenuItems={[
            <Menu.Item
              key="1"
              as={Link}
              to={SIGN_UP_URL}
              name={SIGN_UP_URL}
              style={{
                border: "2px solid black",
                fontWeight: "900"
              }}
            />
          ]}
        />

        <div
          style={{
            backgroundColor: "#2b3137",
            color: "#fff",
            overflowY: "scroll",
            flex: 1
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "20px"
            }}
          >
            <h1>{uiTexts.story.header}</h1>

            <p>
              ResumeMakr is a platform inspired by you, for your career success.
              From the new graduate to the executive, you can craft compelling
              resumes to power your career.
            </p>
          </div>

          <SignUp {...props} />
        </div>
      </div>
    </Layout>
  );
}
