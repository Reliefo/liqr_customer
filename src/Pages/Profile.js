/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import { Card, Button, Modal } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Status.css";
import login from "../assets/login.png";
import tableChange from "../assets/tableChange.png";
import previousVisits from "../assets/previousVisits.png";
import notifications from "../assets/notifications.png";
import settings from "../assets/settings.png";

import * as TYPES from "Store/actionTypes.js";

const Table = (props) => {
  // $rest-font
  const rest_font = "Inconsolata";

  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      orderSuccess,
      searchClicked,
      // tableUsers,
      tableName,
      orderingAbility,
      themeProperties,
    },
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    console.log("Table screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Profile" });

    /////THEMEING //////
    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-menu-background-color",
        "--second-menu-background-color",
        "--first-pattern-light-color",
        "--second-pattern-light-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
    }
    /////THEMEING //////

    props.socket
      .off("cancel_items_request")
      .on("cancel_items_request", (msg) => {
        const data = JSON.parse(msg);
        dispatch({
          type: TYPES.REFRESH_ORDER_CLOUD,
          payload: data.table_orders,
        });
      });

    props.socket.off("new_orders").on("new_orders", (msg) => {
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
    });

    props.socket.off("billing").on("billing", (msg) => {
      const ms = JSON.parse(msg);
      const { order_history } = ms;
      props.history.push("/billing", {
        data: order_history,
      });
      const { message } = ms;

      toast.info(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id"),
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("table_details").on("table_details", (msg) => {
      const data = JSON.parse(msg);
      dispatch({ type: TYPES.REFRESH_ORDER_CLOUD, payload: data.table_orders });
    });

    props.socket.off("order_updates").on("order_updates", (msg) => {
      dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
    });
  }, []);

  const [state, setState] = React.useState({
    showData: true,
  });

  const handleClose = () => setState({ showData: false });

  return (
    <>
      {localStorage.getItem("table_id") === null && state.showData === true ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={state.showData}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Please scan a new table to continue</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : searchClicked === true ? (
        <SearchFoodItems />
      ) : orderingAbility === false ? (
        <div className="status-screen">
          <p className="cart-styling">
            Ordering has been disabled by the restaurant manager
          </p>
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          style={{ backgroundColor: "white" }}
          className="status-screen"
        >
          <div
            className="order-status-styling"
            style={{ display: "flex", flexDirection: "column" }}
          >
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
          </div>
        </div>
      )}
    </>
  );
};

const tableWthSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Table {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default tableWthSocket;
