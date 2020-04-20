import React from "react";
import { ReactComponent as CartSVG } from "assets/cart.svg";
// import { ReactComponent as MenuSVG } from "assets/menu.svg";
import { ReactComponent as HomeSVG } from "assets/home.svg";
import home from "../assets/home.png";
import menu from "../assets/menu.png";
import cart from "../assets/cart.png";
import order from "../assets/order.png";

import { ReactComponent as TableFilledIMG } from "assets/Table-Filled.svg";
import { ReactComponent as MenuSVG } from "assets/meal.svg";
import { Link } from "react-router-dom";
import { StoreContext } from "Store";
import { ReactComponent as WaterSVG } from "assets/water.svg";
import { ReactComponent as TissueSVG } from "assets/tissue.svg";
// import { ReactComponent as HelpSVG } from "assets/help.svg";
import { ReactComponent as DoubleArrow } from "assets/double-arrow.svg";
import * as TYPES from "Store/actionTypes.js";
const FooterNav = () => {
  const {
    state: { activeNav },
    dispatch
  } = React.useContext(StoreContext);

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
  return (
    <div className="footer-nav">
      <div
        className={`floating-container ${state.fabClicked ? "rotate-fab" : ""}`}
        style={{ transform: trfm }} //this rotation takes care of all other rotations.
      >
        <div className="FAB" onClick={FABClick} style={{ transform: revtrfm }}>
          <span className="plus_cross">+</span>
        </div>
        <div className="floating-action-1 FAB" style={{ transform: revtrfm }}>
          <WaterSVG height="1.5rem" />
        </div>
        <div
          className="floating-action-2 FAB"
          onClick={() => setDeg(state => -state - 100)}
          style={{ transform: revtrfm }}
        >
          <DoubleArrow
            height="1.5rem"
            width="1.5rem"
            style={{ transform: revtrfm }}
          />
        </div>
        <div className="floating-action-3 FAB" style={{ transform: revtrfm }}>
          <TissueSVG height="1.5rem" width="1.5rem" />
        </div>
        <div className="floating-action-4 FAB" style={{ transform: revtrfm }}>
          <TissueSVG height="1.5rem" width="1.5rem" />
        </div>
        <div className="floating-action-5 FAB" style={{ transform: revtrfm }}>
          <TissueSVG height="1.5rem" width="1.5rem" />
        </div>
        <div className="floating-action-3 FAB" style={{ transform: revtrfm }}>
          <TissueSVG height="1.5rem" width="1.5rem" />
        </div>
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
      <Link to="/table" className="styled-link">
        <div style={{ marginTop: "calc(.7rem - 3px)" }}>
          <img src={order} alt="Table" className={fillSvg("Table")} />
          <span className="icon-text">Table</span>
        </div>
      </Link>
    </div>
  );
};

export default FooterNav;

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
