/* eslint-disable */
import React from "react";
import home from "../assets/home.png";
import menu from "../assets/menu.png";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import cartImage from "../assets/cart.png";
import order from "../assets/order.png";
import assist from "../assets/assist.png";
import { Badge } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import SocketContext from "../socket-context";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./FooterNav.css";
const FooterNav = (props) => {
  //$rest-font
  const {
    state: {
      activeNav,
      cart,
      fabClick,
      menuClick,
      cartData,
      orderingAbility,
      displayOrderButtons,
      themeProperties,
      // rawData: { food_menu = [] },
    },
    dispatch,
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    props.socket.off("assist").on("assist", (ms) => {
      const message = JSON.parse(ms);
      const { msg } = message;

      toast.info(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    /////THEMEING //////
    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-footer-color",
        "--second-footer-color",
        "--categories-button-color",
        "--categories-list-item-color",
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
  }, [props, props.socket, props.location, dispatch]);

  const divClasses = (name) => disablingOrdering(name) + " " + fillDiv(name);

  const fillDiv = (name) => (activeNav === name ? "active-icon-select" : "");

  const disablingOrdering = (name) => {
    return orderingAbility === true ? "" : disabledFillSvg(name);
  };

  const disabledFillSvg = (name) =>
    displayOrderButtons === true ? "icon-disabled" : "icon-hidden";
  const fillSvg = (name) =>
    activeNav === name ? "icon-active" : "icon-inactive";
  const [deg, setDeg] = React.useState(0);
  const [state, setState] = React.useState({
    fabClicked: false,
    menuClick: false,
  });

  let cartCount = 0;
  let sum = 0;

  cart.forEach((item) => {
    if (item.options) {
      sum += parseInt(item.options.option_price) * item.quantity;
    } else {
      sum += parseInt(item.price * item.quantity);
    }
    let addonPrice = 0;
    if (item.hasOwnProperty("addon")) {
      item.addon.forEach((addon) => {
        if (typeof addon === "object") {
          addonPrice += parseInt(addon.price);
        }
      });
    }

    sum += addonPrice;
    cartCount++;
  });
  const trfm = `rotate(${deg}deg)`;
  // const revtrfm = `rotate(${-deg}deg)`;

  const FABClick = () => {

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: !fabClick });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  };

  const MenuClick = () => {
    console.log("clicked...");

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: !menuClick });
  };

  const sendAssistance = (name) => {
    const body = {
      table: localStorage.getItem("table_id"),
      user: localStorage.getItem("user_id"),
      assistance_type: name,
      after_billing: false,
    };

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: !fabClick });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    props.socket.emit("assistance_requests", JSON.stringify(body));
  };

  const closeMenu = () => {
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  };

  const footerDiv =
    activeNav === "Home"
      ? "footer-nav footer-theme custom-home-nav"
      : "footer-nav footer-theme";
  const floatingButtons = () => (
    <>

      {activeNav === "Menu" && (
                <div className="floating-container-menu" onClick={MenuClick}>
                  <div className="menu-button-footer">
                    <span>Categories</span>
                  </div>
                </div>
              )}
              <div className="floating-menu-div">
                {menuClick && (
                  <div className="floating-container-menu-items">
                    <div className="floating-container menu-button">
                      {cartData.map((item, idx) => {
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
                              {item.name}
                            </AnchorLink>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`floating-container ${fabClick ? "rotate-fab" : ""}`}
                style={{ transform: trfm }} //this rotation takes care of all other rotations.
              >
                <div className="FAB" onClick={FABClick}>
                  <span className="assist-button-text">Assist</span>
                  <img
                    src={assist}
                    alt="Table"
                    className="assist-button-image"
                  />
                </div>
                {fabClick && (
                  <div className="floating-container">
                    <div className="floating-menu">
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("water")}
                      >
                        Ask for Water
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("help")}
                      >
                        Call for Assistance
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("cutlery")}
                      >
                        Call for Cutlery
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("tissue")}
                      >
                        Ask for Tissue
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("cleaning")}
                      >
                        Ask for Cleaning
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("menu")}
                      >
                        Ask for Physical Menu
                      </div>
                      <div
                        className="floating-assistance"
                        onClick={() => sendAssistance("ketchup")}
                      >
                        Ask for Ketchup
                      </div>
                    </div>
                  </div>
                )}
              </div>
    </>
  );
  return (
    <>
      <ToastContainer
        toastClassName="dark-toast"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {props.location.pathname === "/register" ||
      props.location.pathname === "/login" ||
      props.location.pathname === "/jm" ||
      props.location.pathname === "/" ? null : (
        <div>
          {cartCount > 0 && props.location.pathname === "/menu" ? (
            <div
              // style={{
              //   fontSize: "16px",
              //   fontFamily: rest_font,
              //   height: "100px",
              // color: "black",
              //   display: "block",
              // }}
              className="footer-nav footer-theme go-to-cart-footer"
            >
              {floatingButtons()}
              <div className="footerOrderTotal">
                <span>
                  {cartCount} {cartCount < 2 ? "Item" : "Items"} | ₹{sum}{" "}
                </span>{" "}
              </div>
              <div className="footerOrder">
                <Button
                  className="add-button-item-menu"
                  variant="primary"
                  onClick={() => props.history.push("/cart")}
                >
                  Order
                </Button>
              </div>
            </div>
          ) : (
            <div className={footerDiv}>
              {floatingButtons()}
              <Link
                to="/Home"
                className="styled-link"
                onClick={() =>
                  setState((state) => ({ ...state, menuClick: false }))
                }
              >
                <div
                  className={fillDiv("Home")}
                  style={{ marginBottom: "calc(.7rem - 3px)" }}
                >
                  <img src={home} alt="Home" className={fillSvg("Home")} />
                  <span className="icon-text">Home</span>
                </div>
              </Link>
              <Link to="/menu" className="styled-link">
                <div
                  className={fillDiv("Menu")}
                  style={{ marginBottom: "calc(.7rem - 3px)" }}
                >
                  <img src={menu} alt="Menu" className={fillSvg("Menu")} />
                  <span className="icon-text">Menu</span>
                </div>
              </Link>
              <Link
                to="/cart"
                className="styled-link"
                onClick={(event) => {
                  setState((state) => ({ ...state, menuClick: false }));
                  if (!displayOrderButtons) {
                    event.preventDefault();
                  }
                }}
              >
                <div
                  className={divClasses("Cart")}
                  style={{ marginBottom: "calc(.7rem - 3px)" }}
                >
                  {cartCount > 0 ? (
                    <Badge
                      variant="danger"
                      style={{ position: "absolute", top: "-7px" }}
                    >
                      {cartCount}
                    </Badge>
                  ) : null}{" "}
                  <img src={cartImage} alt="Cart" className={fillSvg("Cart")} />
                  <span className="icon-text">Cart</span>
                </div>
              </Link>
              <Link
                to="/order"
                className="styled-link"
                onClick={(event) => {
                  setState((state) => ({ ...state, menuClick: false }));
                  if (!displayOrderButtons) {
                    event.preventDefault();
                  }
                }}
              >
                <div
                  className={divClasses("Order")}
                  style={{ marginBottom: "calc(.7rem - 3px)" }}
                >
                  <img src={order} alt="Table" className={fillSvg("Order")} />
                  <span className="icon-text">Status</span>
                </div>
              </Link>
              {/* <Link
                to="/order"
                className="styled-link"
                onClick={() =>
                  setState(state => ({ ...state, menuClick: false }))
                }
              >
                <div
                  className={fillDiv("Order")}
                  style={{ marginBottom: "calc(.7rem - 3px)" }}
                >
                  <img src={order} alt="Table" className={fillSvg("Order")} />
                  <span className="icon-text">Order</span>
                </div>
              </Link> */}
            </div>
          )}
        </div>
      )}
    </>
  );
};

/*

*/

/* ZOMATo STYLE
      <div className="floating-container FAB">
        <span className="plus_cross">+</span>
        <div className="fab-actions">
          <ul>
            <li>Water</li>
            <li>Tissue</li>
            <li>Help</li>
            <li>..</li>
          </ul>
        </div>
      </div>
*/

const FooterNavSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <FooterNav {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default withRouter(FooterNavSocket);
