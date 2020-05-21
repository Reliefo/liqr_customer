import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";

import * as TYPES from "Store/actionTypes.js";

const DineHistory = props => {
  const {
    dispatch,
    state: { dineHistory }
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Dine in histroy screen screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "history" });
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <div className="order-status-styling">
          {dineHistory.map(item => {
            return (
            <div>
              {item.restaurant_name}
            </div>
            )
          })}
        </div>
      </div>
    </>
  );
};

const dineWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <DineHistory {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default dineWithSocket;
