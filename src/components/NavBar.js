import React from "react";
import { slide as Menu } from "react-burger-menu";
import location from "../assets/location.png";
import login from "../assets/login.png";
import notifications from "../assets/notifications.png";
import previousVisits from "../assets/previousVisits.png";
import settings from "../assets/settings.png";
import tableChange from "../assets/tableChange.png";

export default props => {
  return (
    <Menu disableAutoFocus width={"55%"}>
      <a className="menu-item shadow-menu" href="/menu">
        <img className="navbar-menu-icon" src={login} alt="Login" /> Login/
        SignUp
      </a>
      <hr />

      <a className="menu-item" href="/menu">
        <img className="navbar-menu-icon" src={tableChange} alt="Login" /> Table
        Change
      </a>

      <a className="menu-item" href="/menu">
        <img className="navbar-menu-icon" src={previousVisits} alt="Login" />{" "}
        Previous Visits
      </a>

      <a className="menu-item" href="/menu">
        <img className="navbar-menu-icon" src={location} alt="Login" /> Dine-in
        History
      </a>

      <a className="menu-item" href="/menu">
        <img className="navbar-menu-icon" src={notifications} alt="Login" />{" "}
        Notifications
      </a>
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
  );
};
