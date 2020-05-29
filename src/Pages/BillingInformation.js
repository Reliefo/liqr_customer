/* eslint-disable no-unused-expressions */
import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";

import * as TYPES from "Store/actionTypes.js";

const BillingInformation = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      searchClicked,
      orderSuccess,
      dineHistory
    }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Billing Information screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });
  }, []);

  console.log("NIDS--->", orderSuccess);

  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          style={{ backgroundColor: "white" }}
        >
          <div className="order-status-styling">
            {orderSuccess.map((item, idx) => {
              let sum = 0;
              let orderTime = item.timestamp.split(" ");
              let orderDate = orderTime[0];
              orderTime = orderTime[1].split(".");

              return (
                <div style={{ paddingBottom: "3%" }}>
                  <Card
                    onClick={() => props.history.goBack()}
                    className="cart-card cart-styling margin-styling"
                  >
                    <div>
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "50px"
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize"
                          }}
                        >
                          {orderDate}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

const BillingSocket = props => (
  <SocketContext.Consumer>
    {socket => <BillingInformation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default BillingSocket;
