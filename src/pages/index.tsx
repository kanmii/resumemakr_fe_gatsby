import React from "react";
import { Link } from "gatsby";
import { Menu } from "semantic-ui-react";
import { RouteComponentProps } from "@reach/router";

import Layout from "../components/Layout";
import Header from "../components/Header";
import { SIGN_UP_URL } from "../routing";
import SignUp from "../components/SignUp";
import { AppContainer } from "../styles/mixins";

export default function IndexPage(props: RouteComponentProps) {
  return (
    <Layout>
      <AppContainer>
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
            <h1>Built for your career success</h1>

            <p>
              ResumeMakr is a platform inspired by you, for your career success.
              From the new graduate to the executive, you can craft compelling
              resumes to power your career.
            </p>
          </div>

          <SignUp {...props} />
        </div>
      </AppContainer>
    </Layout>
  );
}
