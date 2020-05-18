import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";

import * as TYPES from "Store/actionTypes.js";

const Table = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      orderSuccess,
      searchClicked,
      tableUsers
    }
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Table screen");
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
        <div style= {{backgroundColor: 'white'}}>
          <div className="order-status-styling">
            {orderSuccess.map((item, idx) => {
              let orderTime = item.timestamp.split(" ");

              orderTime = orderTime[1].split(".");

              return (
                <div style={{ paddingBottom: "3%" }}>
                  <Card className="cart-card cart-styling margin-styling">
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
                          style={{ float: "left", textTransform: "capitalize" }}
                        >
                          Table Order {idx + 1}
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
                      {item.orders.map(item2 => {
                        let placedBy = [];
                        return item2.food_list.map((item3, index) => {
                          let flag = false;
                          if (!placedBy.includes(item2.placed_by.id)) {
                            placedBy.push(item2.placed_by.id);
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
                                  {item2.placed_by.name}
                                </Card.Title>
                              ) : (
                                ""
                              )}
                              <Card.Body style={{ padding: "2%" }}>
                                <div>
                                  <span className="item-status">
                                    {item3.name} x {item3.quantity}
                                  </span>
                                  <span className="item-status-tagging">
                                    Status: {item3.status}{" "}
                                    {item3.status === "delivered" ? (
                                      <FoodSVG />
                                    ) : item3.status === "queued" ? (
                                      <UiSVG />
                                    ) : (
                                      <FlatSVG />
                                    )}{" "}
                                  </span>
                                </div>
                              </Card.Body>
                            </div>
                          );
                        });
                      })}
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

const tableWthSocket = props => (
  <SocketContext.Consumer>
    {socket => <Table {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default tableWthSocket;
