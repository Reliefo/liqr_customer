/* eslint-disable no-unused-expressions */
/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import { Card } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";

import * as TYPES from "Store/actionTypes.js";

const DineHistory = (props) => {
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [] },
      searchClicked,
      dineHistory,
      themeProperties,
      currency,
    },
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    console.log("Dine in History screen");
    //handling refresh issue
    /////THEMEING //////
    if (themeProperties['theme'] === true) {
      let cssVariables = [
        '--theme-font', 
        '--first-menu-background-color', 
        '--second-menu-background-color', 
        '--first-pattern-light-color', 
        '--second-pattern-light-color', 
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(item, themeProperties['variables'][item]);
      });
    }
    /////THEMEING //////
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });

    props.socket.off("new_orders").on("new_orders", (msg) => {
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
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

  console.log("TAER--->", dineHistory);

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
          className="default-screen"
        >
          <div className="order-status-styling">
            {dineHistory.map((item, idx) => {
              let orderTime = item.timestamp.split(" ");
              let orderDate = orderTime[0];
              orderTime = orderTime[1].split(".");

              return (
                <div style={{ paddingBottom: "3%" }}>
                  <Card
                    onClick={() =>
                      props.history.push("/visits", {
                        data: item,
                        index: idx,
                      })
                    }
                    className="cart-card cart-styling margin-styling"
                  >
                    <div>
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "50px",
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{
                            float: "left",
                            textTransform: "capitalize",
                            fontWeight: 700,
                          }}
                        >
                          {item.restaurant_name}
                        </p>
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize",
                          }}
                        >
                          {orderDate}
                        </p>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "50px",
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{ float: "left", textTransform: "capitalize" }}
                        >
                          Order Total <br />{currency}{" "}
                          {item.bill_structure["Total Amount"]}
                        </p>
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize",
                          }}
                        >
                          {orderTime[0]}
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

const dineSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <DineHistory {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default dineSocket;
