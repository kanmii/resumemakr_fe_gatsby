import React, { useState } from "react";
import {
  Input,
  Menu,
  Icon,
  Label,
  Dropdown,
  Responsive
} from "semantic-ui-react";
import { Link, navigate } from "@reach/router";

import {
  LOGIN_URL,
  ROOT_URL,
  SIGN_UP_URL,
  PASSWORD_RESET_PATH,
  removeTrailingSlash
} from "../../routing";
import { Container, LogoAnchor, LogoSpan } from "./header-styles";
import { Props } from "./header";
import { UserFragment } from "../../graphql/apollo/types/UserFragment";

export function Header(merkmale: Props) {
  const [aktiveArtikel] = useState("home");

  const {
    leftMenuItems = [],
    rightMenuItems = [],
    userLocal,
    logoAttrs,
    updateLocalUser,
    location
  } = merkmale;

  const user = userLocal && userLocal.user;

  // istanbul ignore next:
  const pathname = removeTrailingSlash((location && location.pathname) || "");

  let homeLinkProps = {};

  if (pathname !== ROOT_URL && !user) {
    homeLinkProps = { as: LogoAnchor, to: ROOT_URL };
  } else {
    homeLinkProps = { as: LogoSpan };
  }

  const showAuthLinks =
    (!user && pathname === ROOT_URL) || pathname === PASSWORD_RESET_PATH;

  return (
    <Container>
      <Menu secondary={true}>
        <Menu.Item
          {...homeLinkProps}
          className="logo"
          name="home"
          active={aktiveArtikel === "home"}
          {...logoAttrs}
        />
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
    </Container>
  );
}

export default Header;

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
