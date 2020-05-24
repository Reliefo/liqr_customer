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

const DineHistory = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      searchClicked,
      tableUsers,
      dineHistory
    }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Dine in History screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });

    props.socket.off("new_orders").on("new_orders", msg => {
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
    });

    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id")
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("table_details").on("table_details", msg => {
      const data = JSON.parse(msg);
      dispatch({ type: TYPES.REFRESH_ORDER_CLOUD, payload: data.table_orders });
    });

    props.socket.off("order_updates").on("order_updates", msg => {
      dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
    });
  }, []);

  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div style={{ backgroundColor: "white" }}>
          <div className="order-status-styling">
            {dineHistory.map((item, idx) => {
              let sum = 0;
              let orderTime = item.timestamp.split(" ");
              let orderDate = orderTime[0];
              orderTime = orderTime[1].split(".");

              return (
                <div style={{ paddingBottom: "3%" }}>
                  <Card
                    onClick={() =>
                      props.history.push("/visits", {
                        data: item,
                        index: idx
                      })
                    }
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
                            float: "left",
                            textTransform: "capitalize",
                            fontWeight: 700
                          }}
                        >
                          {item.restaurant_name}
                        </p>
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
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "50px"
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{ float: "left", textTransform: "capitalize" }}
                        >
                          Order Total <br />
                          {Object.entries(item).forEach(item5 => {
                            if (item5[0] === "table_orders") {
                              if (item5[1] && item5[1].length > 0) {
                                item5[1].forEach(item4 => {
                                  item4.orders.forEach(item9 => {
                                    item9.food_list.forEach(item3 => {
                                      if (item.options) {
                                        sum +=
                                          parseInt(item3.options.option_price) *
                                          item3.quantity;
                                      } else {
                                        sum += parseInt(
                                          item3.price * item3.quantity
                                        );
                                      }
                                    });
                                  });
                                });
                              }
                            }
                          })}
                          ₹ {sum}
                        </p>
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize"
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

const dineSocket = props => (
  <SocketContext.Consumer>
    {socket => <DineHistory {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default dineSocket;
