import React from "react";
import home from "../assets/Home.png";
import menu from "../assets/menu.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import cartImage from "../assets/cart.png";
import AppWrapper from "../App";
import ReactDOM from "react-dom";
import order from "../assets/order.png";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import SocketContext from "../socket-context";
import { StoreContext } from "Store";
import { ReactComponent as WaterSVG } from "assets/water.svg";
import { ReactComponent as TissueSVG } from "assets/tissue.svg";
// import { ReactComponent as HelpSVG } from "assets/help.svg";
import { ReactComponent as DoubleArrow } from "assets/double-arrow.svg";
import * as TYPES from "Store/actionTypes.js";
const FooterNav = props => {
  const {
    state: {
      activeNav,
      tableId,
      cart,
      fabClick,
      menuClick,
      activeData,
      placeOrderById,
      rawData: { food_menu = [] }
    },
    dispatch
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    if (((props.location && props.location.state.login === false) ||
        undefined ||
        null) &&
      props.socket.connected === false
    ) {
      axios({
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
        },
        url: "https://liqr.cc/refresh"
      }).then(response => {
        const { data } = response;

        setTimeout(function() {
          if (props.socket.connected === false) {
            localStorage.setItem("jwt", data.access_token);
            //Start the timer
            ReactDOM.render(<AppWrapper />, document.getElementById("root"));
          }
        }, 1000);
      });
    }
    props.socket.off("assist").on("assist", ms => {
      const message = JSON.parse(ms);
      const { msg } = message;

      toast.info(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    });
  }, [props.socket, props.location, dispatch]);

  const fillSvg = name =>
    activeNav === name ? "icon-active" : "icon-inactive";
  const [deg, setDeg] = React.useState(0);
  const [state, setState] = React.useState({
    fabClicked: false,
    menuClick: false
  });

  const fillDiv = name => (activeNav === name ? "active-icon-select" : "");

  let cartCount = 0;
  cart.forEach(item => {
    cartCount++;
  });
  const trfm = `rotate(${deg}deg)`;
  const revtrfm = `rotate(${-deg}deg)`;

  const FABClick = () => {
    console.log("clicked...");

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: !fabClick });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  };

  const MenuClick = () => {
    console.log("clicked...");

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: !menuClick });
  };

  const sendAssistance = name => {
    const body = {
      table: localStorage.getItem("table_id"),
      user: localStorage.getItem("user_id"),
      assistance_type: name
    };

    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: !fabClick });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    props.socket.emit("assistance_requests", JSON.stringify(body));
  };

  const footerDiv =
    activeNav === "Home" ? "footer-nav custom-home-nav" : "footer-nav";

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
      <div className={footerDiv}>
        {activeNav === "Menu" && (
          <div className="floating-container-menu">
            <div className="menu-button-footer" onClick={MenuClick}>
              <span>Menu</span>
            </div>
          </div>
        )}
        {menuClick && (
          <div className="floating-container-menu">
            <div
              className="floating-container menu-button"
              style={{ marginBottom: "2.5rem" }}
            >
              {activeData.map((item, idx) => {
                return (
                  <div key={idx}>
                    <a href={`#menu-${idx}`}> {item.name}</a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div
          className={`floating-container ${fabClick ? "rotate-fab" : ""}`}
          style={{ transform: trfm }} //this rotation takes care of all other rotations.
        >
          <div className="FAB" onClick={FABClick}>
            <span>Assist</span>
          </div>
          {fabClick && (
            <div className="floating-container">
              <div className="floating-menu">
                <div onClick={() => sendAssistance("water")}>Ask for Water</div>
                <div onClick={() => sendAssistance("help")}>
                  Call for Assistance
                </div>
                <div onClick={() => sendAssistance("cutlery")}>
                  Call for Cutlery
                </div>
                <div onClick={() => sendAssistance("tissue")}>
                  Ask for Tissue
                </div>
                <div onClick={() => sendAssistance("cleaning")}>
                  Ask for Cleaning
                </div>
                <div onClick={() => sendAssistance("menu")}>
                  Ask for Physical Menu
                </div>
                <div onClick={() => sendAssistance("ketchup")}>
                  Ask for Ketchup
                </div>
              </div>
            </div>
          )}
        </div>
        <Link
          to="/Home"
          className="styled-link"
          onClick={() => setState(state => ({ ...state, menuClick: false }))}
        >
          <div
            className={fillDiv("Home")}
            style={{ marginTop: "calc(.7rem - 3px)" }}
          >
            <img src={home} alt="Home" className={fillSvg("Home")} />
            <span className="icon-text">Home</span>
          </div>
        </Link>
        <Link to="/menu" className="styled-link">
          <div
            className={fillDiv("Menu")}
            style={{ marginTop: "calc(.7rem - 3px)" }}
          >
            <img src={menu} alt="Menu" className={fillSvg("Menu")} />
            <span className="icon-text">Menu</span>
          </div>
        </Link>
        <Link
          to="/cart"
          className="styled-link"
          onClick={() => setState(state => ({ ...state, menuClick: false }))}
        >
          <div
            className={fillDiv("Cart")}
            style={{ marginTop: "calc(.7rem - 15px)" }}
          >
            <Badge variant="danger">{cartCount}</Badge>{" "}
            <img src={cartImage} alt="Cart" className={fillSvg("Cart")} />
            <span className="icon-text">Cart</span>
          </div>
        </Link>
        <Link
          to="/order"
          className="styled-link"
          onClick={() => setState(state => ({ ...state, menuClick: false }))}
        >
          <div
            className={fillDiv("Order")}
            style={{ marginTop: "calc(.7rem - 3px)" }}
          >
            <img src={order} alt="Table" className={fillSvg("Order")} />
            <span className="icon-text">Order</span>
          </div>
        </Link>
      </div>
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

const FooterNavSocket = props => (
  <SocketContext.Consumer>
    {socket => <FooterNav {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default FooterNavSocket;
