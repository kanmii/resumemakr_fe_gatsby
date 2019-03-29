import React, { useState } from "react";
import {
  Input,
  Menu,
  Icon,
  Label,
  Dropdown,
  Responsive
} from "semantic-ui-react";
import { Link, navigate, Location } from "@reach/router";

import {
  LOGIN_URL,
  ROOT_URL,
  SIGN_UP_URL,
  PASSWORD_RESET_PATH,
  removeTrailingSlash
} from "../../routing";
import { Container, LogoAnchor, LogoSpan } from "./header-styles";
import { Props } from "./header";

export function Header(merkmale: Props) {
  const [aktiveArtikel] = useState("home");

  const {
    leftMenuItems = [],
    rightMenuItems = [],
    userLocal,
    logoAttrs,
    updateLocalUser
  } = merkmale;

  const user = userLocal && userLocal.user;

  function suchen() {
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

  return (
    <Location>
      {({ location: { pathname } }) => {
        pathname = removeTrailingSlash(pathname);

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

                {user && suchen()}

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
      }}
    </Location>
  );
}

export default Header;
