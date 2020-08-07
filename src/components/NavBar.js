import React from "react";
import { slide as Menu } from "react-burger-menu";
import location from "../assets/location.png";
import login from "../assets/login.png";
import notifications from "../assets/notifications.png";
import SocketContext from "../socket-context";
import previousVisits from "../assets/previousVisits.png";
import settings from "../assets/settings.png";
import tableChange from "../assets/tableChange.png";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";
import "./NavBar.css";
import Search from "../Pages/Search.js";
import { Container, Row, Col } from "react-bootstrap";
import Burger from "react-css-burger";
import { HamburgerButton } from "react-hamburger-button";
import { ReactComponent as SearchSVG } from "assets/searchIcon3.svg";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { withRouter } from "react-router-dom";

const Navbar = (props) => {
  // const [prevScrollpos, setPrevScrollpos] = React.useState(window.pageYOffset);
  const [visible, setVisible] = React.useState(false);
  const {
    dispatch,
    state: {
      // rawData: { name },
      tableName,
      restId,
      themeProperties,
      menuClick,
      currentMenu,
      barFoodMenuCats,
    },
  } = React.useContext(StoreContext);

  // const searchValueChange = ({ target: { value } }) => {
  //   dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  // };

  React.useEffect(() => {
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--top-bar-color",
        "--search-background-color",
        "--burger-menu-background-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
    }
  }, [dispatch, restId, themeProperties]);

  // const searchIconClick = () => {
  //   inputNode.current.focus();
  //   dispatch({
  //     type: TYPES.SET_GENERAL_DATA,
  //     payload: { searchClicked: true },
  //   });
  // };
  // const closeSearchHndlr = () => {
  //   dispatch({
  //     type: TYPES.SET_GENERAL_DATA,
  //     payload: { searchClicked: false },
  //   });
  // };

  const logoutUser = () => {
    localStorage.removeItem("table_id");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("registeredUser");
    localStorage.removeItem("email_id");
    sessionStorage.removeItem("relief");
    localStorage.removeItem("restaurant_id");
  };

  const isMenuOpen = function(state) {
    setVisible(state.isOpen);
    return state.isOpen;
  };
  const closeMenu = () => {
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  };
  const searchIconClick = () => {
    props.history.push("/searchItems");
  };
  const burgerMenu = {
    position: "absolute",
    margin: "0px",
    paddingBottom: "0px",
    border: "2px solid #ffffff",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.2)",
    top: "-0.1rem",
    left: "-0.2rem",
  };
  return (
    <>
      {window.location.pathname === "/jm" ||
      window.location.pathname === "/" ||
      window.location.pathname === "/login" ? (
        <div></div>
      ) : (
        <div>
          <nav className="navbar">
            <Container fluid>
              <Row className="w-100">
                <Col xs={1} md={1} style={{ padding: "0px" }}>
                  <Burger
                    onClick={() => setVisible(!visible)}
                    active={visible}
                    burger="spin"
                    style={burgerMenu}
                  />
                </Col>
                <Col
                  xs={10}
                  md={10}
                  // style={{ padding: "0px" }}
                >
                  <div className="floating-menu-div">
                    {menuClick && (
                      <div className="floating-container-menu-items">
                        <div className="floating-container menu-button">
                          {barFoodMenuCats[currentMenu].map((item, idx) => {
                            return (
                              <div
                                className="floating-menu-items"
                                key={idx}
                                onClick={() => closeMenu(idx)}
                              >
                                {/* <a href={`#menu-${idx}`}> <span>{item.name}</span></a> */}
                                <AnchorLink
                                  className="anchor-menu"
                                  offset="90"
                                  href={`#menu-${idx}`}
                                >
                                  {item}
                                </AnchorLink>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <Search /> */}
                  {/* <p>Random</p> */}
                </Col>
                <Col xs={1} md={1} style={{ padding: "0.5rem 0px" }}>
                  <SearchSVG onClick={searchIconClick} className="search-svg" />
                </Col>
              </Row>
            </Container>
            <div style={{ zIndex: 422 }}>
              <div>
                {/* <span className="restaurant-header">
          {name}
          </span>
          <span className="username">
          ${localStorage.getItem('name')}
          </span>
          <SearchSVG onClick={searchIconClick} className="search-svg" />
          <div
            className="nav-search-bar"
            style={{ opacity: searchClicked ? 1 : 0 }}
          >
            <input
              ref={inputNode}
              value={searchValue}
              onChange={searchValueChange}
              type="text"
            />
            <span className="ml-3" onClick={closeSearchHndlr}>
              X
            </span>
          </div> */}
              </div>
              <div style={{ float: "right", marginRight: "2%" }}>
                {props.socket.connected === true ? (
                  <span className="socket-indicator socket-indicator-green"></span>
                ) : (
                  <span className="socket-indicator socket-indicator-red"></span>
                )}
              </div>
            </div>
          </nav>

          <Menu
            disableAutoFocus
            isOpen={visible}
            onStateChange={isMenuOpen}
            width={"70%"}
            style={{ zIndex: 424 }}
            customBurgerIcon={
              false
              // <Burger
              //   onClick={() => setVisible(!visible)}
              //   active={visible}
              //   burger="arrow"
              //   color="black"
              //   hoverOpacity={0.8}
              //   scale={1}
              //   marginTop={"0.5rem"}
              //   marginLeft={"0.2rem"}
              //   style={{ zIndex: 9, position: "relative", top: "0px" }}
              // />
            }
            customCrossIcon={false}
          >
            <Burger
              onClick={() => setVisible(!visible)}
              active={visible}
              burger="spin"
              color="black"
              hoverOpacity={0.8}
              scale={0.6}
              style={{
                ...burgerMenu,
                position: "absolute",
                left: "72%",
              }}
            />
            {localStorage.getItem("registeredUser") === "false" ? (
              <a className="menu-item shadow-menu" href="/login">
                <img className="navbar-menu-icon" src={login} alt="Login" />{" "}
                Login/ SignUp
              </a>
            ) : (
              <a className="menu-item shadow-menu" href="/">
                <img className="navbar-menu-icon" src={login} alt="Login" />{" "}
                Logged In : {localStorage.getItem("name")}
              </a>
            )}
            <a className="menu-item" href="/menu">
              {" "}
              Current Table: {tableName}
            </a>

            <a className="menu-item" href="/menu">
              {" "}
              Name: {localStorage.getItem("name")}
            </a>

            <a className="menu-item" href="/menu">
              <img className="navbar-menu-icon" src={tableChange} alt="Login" />{" "}
              Table Change
            </a>

            <a className="menu-item" href="/previous-visits">
              <img
                className="navbar-menu-icon"
                src={previousVisits}
                alt="Login"
              />{" "}
              Previous Visits
            </a>

            <a className="menu-item" href="/dine-in-history">
              <img className="navbar-menu-icon" src={location} alt="Login" />{" "}
              Dine-in History
            </a>

            <a className="menu-item" href="/menu">
              <img
                className="navbar-menu-icon"
                src={notifications}
                alt="Login"
              />{" "}
              Notifications
            </a>
            {localStorage.getItem("jwt") !== null ? (
              <a
                className="menu-item"
                href="/login"
                onClick={() => logoutUser()}
              >
                <img className="navbar-menu-icon" src={login} alt="Login" />
                Logout
              </a>
            ) : (
              ""
            )}

            <a className="menu-item" href="/menu">
              <img className="navbar-menu-icon" src={settings} alt="Login" />{" "}
              Personal Settings
            </a>

            <div>
              <span> </span>
            </div>

            <div>
              <span> </span>
            </div>

            <div>
              <span> </span>
            </div>
          </Menu>
        </div>
      )}
    </>
  );
};

const navbarWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Navbar {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default withRouter(navbarWithSocket);
