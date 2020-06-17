import React from "react";
import { slide as Menu } from "react-burger-menu";
import location from "../assets/location.png";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import login from "../assets/login.png";
import notifications from "../assets/notifications.png";
import SocketContext from "../socket-context";
import previousVisits from "../assets/previousVisits.png";
import settings from "../assets/settings.png";
import tableChange from "../assets/tableChange.png";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";

const Navbar = props => {
  const [showCollapse, setShowCollapse] = React.useState(false);
  const sideDrawerInner = React.useRef();
  const menuRef = React.useRef();
  const inputNode = React.useRef();

  const {
    dispatch,
    state: {
      searchClicked,
      searchValue,
      rawData: { name },
      tableName
    }
  } = React.useContext(StoreContext);

  const searchValueChange = ({ target: { value } }) => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  };

  React.useEffect(() => {
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  }, []);

  const searchIconClick = () => {
    inputNode.current.focus();
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true }
    });
  };
  const closeSearchHndlr = () => {
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
  };

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

  

  return (
    <div>
      {window.location.pathname === "/jm" ? (
        <div></div>
      ) : (
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
          <div style={{ float: "right", marginRight: "5%" }}>
            {props.socket.connected === true ? (
              <span id="connected-socket"></span>
            ) : (
              <span id="dis-connected-socket"></span>
            )}
          </div>
          <Menu disableAutoFocus width={"55%"}>
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
            <hr />

            <a className="menu-item" href="/menu">
              {" "}
              Current Table: {tableName}
            </a>

            <hr />

            <a className="menu-item" href="/menu">
              {" "}
              Name: {localStorage.getItem("name")}
            </a>

            <hr />

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
            <hr className="navbar-menu-hr" />
            <hr className="navbar-menu-hr" />
            <hr className="navbar-menu-hr" />
            <hr className="navbar-menu-hr" />

            <a className="menu-item shadow-menu" href="/menu">
              <hr />
              <img
                className="navbar-menu-icon"
                src={settings}
                alt="Login"
              />{" "}
              Personal Settings
              <hr />
            </a>
          </Menu>
        </div>
      )}
    </div>
  );
};

const navbarWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Navbar {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default navbarWithSocket;
