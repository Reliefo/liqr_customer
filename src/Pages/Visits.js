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

const Visits = props => {
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
    console.log("Visits screen");
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
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          style={{ backgroundColor: "white" }}
        >
          <div className="order-status-styling">
            {dineHistory.map((item, idx) => {
              if (idx === props.location.state.index) {
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
                            minHeight: "70px"
                          }}
                        >
                          <p
                            className="table-name-card"
                            style={{
                              float: "left",
                              textTransform: "capitalize"
                            }}
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
                                            parseInt(
                                              item3.options.option_price
                                            ) * item3.quantity;
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
                        {item.table_orders.map(item2 => {
                          return item2.orders.map(item4 => {
                            let placedBy = [];
                            return item4.food_list.map((item3, index) => {
                              let flag = false;
                              if (!placedBy.includes(item4.placed_by.id)) {
                                placedBy.push(item4.placed_by.id);
                                flag = true;
                              } else {
                                flag = false;
                              }
                              return (
                                <div>
                                  {flag === true ? (
                                    <Card.Title
                                      style={{
                                        padding: "1.25rem",
                                        fontSize: "14px"
                                      }}
                                      className="card-title-name"
                                    >
                                      {item4.placed_by.name}
                                    </Card.Title>
                                  ) : (
                                    ""
                                  )}
                                  <Card.Body style={{ padding: "2%" }}>
                                    <div>
                                      <span className="item-status">
                                        {item3.name} x {item3.quantity}
                                      </span>
                                    </div>
                                    {item3.food_options ? (
                                      <div
                                        style={{
                                          fontFamily: "Poppins",
                                          fontSize: "12px"
                                        }}
                                      >
                                        {
                                          item3.food_options.options[0]
                                            .option_name
                                        }
                                        {item3.food_options.choices[0] &&
                                        item3.food_options.options[0]
                                          .option_name
                                          ? "," + item3.food_options.choices[0]
                                          : ""}
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {/* {item3.food_options ? 
                                <div style={{
                                  fontFamily: 'Poppins',
                                  fontSize: '12px'
                                }}>
                                 {item3.food_options.choices[0].option_name}
                                </div>
                                : ''} */}
                                  </Card.Body>
                                </div>
                              );
                            });
                          });
                        })}
                      </div>
                    </Card>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </>
  );
};

const VisitsWthSocket = props => (
  <SocketContext.Consumer>
    {socket => <Visits {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default VisitsWthSocket;
