import React, { useState } from "react";
import {
  Input,
  Menu,
  Icon,
  Label,
  Dropdown,
  Responsive
} from "semantic-ui-react";
import { Link, navigate, WindowLocation } from "@reach/router";

import "./styles.scss";
import {
  LOGIN_URL,
  ROOT_URL,
  SIGN_UP_URL,
  PASSWORD_RESET_PATH,
  removeTrailingSlash,
  RESUMES_HOME_PATH
} from "../../routing";
import { Props } from "./utils";
import { UserFragment } from "../../graphql/apollo/types/UserFragment";

const HOME_URLS = [RESUMES_HOME_PATH, ROOT_URL];

export function Header(merkmale: Props) {
  const [aktiveArtikel] = useState("home");

  const {
    leftMenuItems = [],
    rightMenuItems = [],
    userLocal,
    logoAttrs,
    updateLocalUser,
    matchResumeRouteProps
  } = merkmale;

  const user = userLocal && userLocal.user;

  const location = matchResumeRouteProps.location as WindowLocation;

  const pathname = removeTrailingSlash(location.pathname);

  const homeUrl = matchResumeRouteProps.match ? RESUMES_HOME_PATH : ROOT_URL;

  let homeLinkProps = {};

  if (HOME_URLS.includes(pathname)) {
    homeLinkProps = { as: "span" };
  } else {
    homeLinkProps = { as: Link, to: homeUrl };
  }

  const showAuthLinks =
    (!user && pathname === ROOT_URL) || pathname === PASSWORD_RESET_PATH;

  return (
    <div className="components-header">
      <Menu secondary={true}>
        <>
          <style>
            {`#components-header-logo{ background: url(${
              logoAttrs.src
            }) no-repeat 0 !important; background-size: ${logoAttrs.width}px ${
              logoAttrs.height
            }px !important;}`}
          </style>

          <Menu.Item
            {...homeLinkProps}
            id="components-header-logo"
            className="logo"
            name="home"
            active={aktiveArtikel === "home"}
          />
        </>
        {leftMenuItems.map(l => l)}

        <Menu.Menu position="right">
          {rightMenuItems.map(r => {
            return r;
          })}

          <Search user={user} />

          <Dropdown
            item={true}
            icon={
              <Label circular={true}>
                <Icon name="user" />
              </Label>
            }
            simple={true}
            style={{ marginRight: 0, paddingRight: "5px" }}
          >
            <Dropdown.Menu>
              {user && (
                <>
                  <Dropdown.Divider />

                  <Dropdown.Item
                    as={Link}
                    to={LOGIN_URL}
                    onClick={async evt => {
                      evt.preventDefault();

                      if (updateLocalUser) {
                        await updateLocalUser({
                          variables: {
                            user: null
                          }
                        });
                      }

                      navigate(LOGIN_URL);
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </>
              )}

              {(pathname === LOGIN_URL || showAuthLinks) && (
                <Dropdown.Item as={Link} to={SIGN_UP_URL}>
                  Sign up
                </Dropdown.Item>
              )}

              {(pathname === SIGN_UP_URL || showAuthLinks) && (
                <Dropdown.Item as={Link} to={LOGIN_URL}>
                  Login
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

function Search({ user }: { user?: UserFragment }) {
  if (!user) {
    return null;
  }

  return (
    <Menu.Item>
      <Responsive
        minWidth={Responsive.onlyTablet.minWidth}
        as={Input}
        icon="search"
        placeholder="Search..."
      />
    </Menu.Item>
  );
}
