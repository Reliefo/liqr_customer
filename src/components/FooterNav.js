import React from "react";
import home from "../assets/home.png";
import menu from "../assets/menu.png";
import cart from "../assets/cart.png";
import order from "../assets/order.png";
import { Link } from "react-router-dom";
import SocketContext from '../socket-context'
import { StoreContext } from "Store";
import { ReactComponent as WaterSVG } from "assets/water.svg";
import { ReactComponent as TissueSVG } from "assets/tissue.svg";
// import { ReactComponent as HelpSVG } from "assets/help.svg";
import { ReactComponent as DoubleArrow } from "assets/double-arrow.svg";
import * as TYPES from "Store/actionTypes.js";
const FooterNav = (props) => {
  const {
    state: { activeNav, tableId, placeOrderById },
    dispatch
  } = React.useContext(StoreContext);


  React.useEffect(() => {
   
    props.socket.off("assist").on("assist", msg => {
   console.log('Assistance--->', msg)
    });
  }, []);

  const fillSvg = name =>
    activeNav === name ? "icon-active" : "icon-inactive";
  const [deg, setDeg] = React.useState(0);
  const [state, setState] = React.useState({
    fabClicked: false
  });
  const trfm = `rotate(${deg}deg)`;
  const revtrfm = `rotate(${-deg}deg)`;

  const FABClick = () => {
    console.log("clicked...");
    setState(state => ({ ...state, fabClicked: !state.fabClicked }));
  };

  const sendAssistance = (name) => {
    const body = {"table": tableId, "user": placeOrderById[0].$oid, "assistance_type": name}
    console.log(body)
    props.socket.emit("assistance_requests", JSON.stringify(body));
  }
  return (
    <>
      <div className="footer-nav">
        <div
          className={`floating-container ${
            state.fabClicked ? "rotate-fab" : ""
          }`}
          style={{ transform: trfm }} //this rotation takes care of all other rotations.
        >
          <div className="FAB" onClick={FABClick}>
            <span>Assist</span>
          </div>
          {state.fabClicked && <div className="floating-container">
          <div className="floating-menu">
          <div onClick={() => sendAssistance('help')}>Call for assistance</div>
          <div onClick={() => sendAssistance('water')}>Ask for water</div>
          <div onClick={() => sendAssistance('help')}>Chat with the Captain</div>
          <div onClick={() => sendAssistance('help')}>Other Neccessities</div>
          <div onClick={() => sendAssistance('menu')}>Get Physical Menu</div>         
          </div>
          </div>}
        </div>

        <Link to="/" className="styled-link">
          <div style={{ marginTop: "calc(.7rem - 3px)" }}>
            <img src={home} alt="Home" className={fillSvg("Home")} />
            <span className="icon-text">Home</span>
          </div>
        </Link>
        <Link to="/menu" className="styled-link">
          <div style={{ marginTop: "calc(.7rem - 3px)" }}>
            <img src={menu} alt="Menu" className={fillSvg("Menu")} />
            <span className="icon-text">Menu</span>
          </div>
        </Link>
        <Link to="/cart" className="styled-link">
          <div style={{ marginTop: "calc(.7rem - 3px)" }}>
            <img src={cart} alt="Cart" className={fillSvg("Cart")} />
            <span className="icon-text">Cart</span>
          </div>
        </Link>
        <Link to="/order" className="styled-link">
          <div style={{ marginTop: "calc(.7rem - 3px)" }}>
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