/* eslint-disable no-unused-expressions */
/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import { Card } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";

import * as TYPES from "Store/actionTypes.js";

const Visits = props => {

  // $rest-font 
  const rest_font = "Inconsolata";
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [] },
      searchClicked,
      dineHistory,
      themeProperties,
      currency,
    }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Visits screen");
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
      payload: { searchClicked: false }
    });
    // dispatch({ type: TYPES.SET_NAV, payload: "Order" });

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
          className="default-screen"
        >
          <div className="order-status-styling">
            {dineHistory.map((item, idx) => {
              if (idx === props.location.state.index) {
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
                            Order Total <br />{currency}{" "}
                            {item.bill_structure["Total Amount"]}
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
                                          fontFamily: rest_font,
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
                                  fontFamily: rest_json,
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
                      <hr />
                      <div
                        style={{
                          float: "left",
                          height: "25px",
                          paddingLeft: "2%",
                          width: "100%",
                          margin: "0 auto"
                        }}
                      >
                        <p
                          className="table-name-card-billing"
                          style={{
                            float: "left",
                            width: "40%",
                            textTransform: "capitalize"
                          }}
                        >
                          <b>Order Total</b>
                        </p>
                        <p
                          className="table-name-card-billing"
                          style={{ float: "right", paddingRight: "10%", height: "25px", }}
                        >
                          <b> {currency} {item.bill_structure["Total Amount"]}</b>
                        </p>
                      </div>
                      <div
                        style={{
                          float: "left",
                          paddingLeft: "2%",
                          height: "25px",
                          width: "100%",
                          margin: "0 auto"
                        }}
                      >
                        <p
                          className="table-name-card-billing"
                          style={{
                            float: "left",
                            width: "40%",
                            
                            textTransform: "capitalize"
                          }}
                        >
                          <b>CGST</b>
                        </p>
                        <p
                          className="table-name-card-billing"
                          style={{ float: "right", paddingRight: "10%" }}
                        >
                          <b> {item.taxes["CGST"]}%</b>
                        </p>
                      </div>
                      <div
                        style={{
                          float: "left",
                          paddingLeft: "2%",
                          height: "25px",
                          width: "100%",
                          margin: "0 auto"
                        }}
                      >
                        <p
                          className="table-name-card-billing"
                          style={{
                            float: "left",
                            width: "40%",
                            textTransform: "capitalize"
                          }}
                        >
                          <b>SGST</b>
                        </p>
                        <p
                          className="table-name-card-billing"
                          style={{ float: "right", paddingRight: "10%" }}
                        >
                          <b> {item.taxes["SGST"]}%</b>
                        </p>
                      </div>
                      <div
                        style={{
                          float: "left",
                          paddingLeft: "2%",

                          width: "100%",
                          margin: "0 auto"
                        }}
                      >
                        <p
                          className="table-name-card-billing"
                          style={{
                            float: "left",
                            width: "40%",
                            textTransform: "capitalize"
                          }}
                        >
                          <b>Service Charge</b>
                        </p>
                        <p
                          className="table-name-card-billing"
                          style={{ float: "right", paddingRight: "10%" }}
                        >
                          <b> {item.taxes["Service"]}%</b>
                        </p>
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
