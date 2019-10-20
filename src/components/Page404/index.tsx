import React from "react";
import { Link } from "gatsby";
import { Button } from "semantic-ui-react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../Header/header.index";
import { ROOT_URL } from "../../routing";

export function Page404(props: RouteComponentProps) {
  return (
    <>
      <Header />

      <div
        style={{
          padding: "20px",
          textAlign: "center"
        }}
      >
        <h1>You are here at #404!</h1>
        <h3>But this is not where you are going!</h3>

        <Button as={Link} to={ROOT_URL} color="green">
          <span
            style={{
              fontWeight: 900,
              fontSize: "2rem"
            }}
          >
            &larr;
          </span>
          Get back home
        </Button>
      </div>
    </>
  );
}
