import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";

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
    console.log("NIDS--->", orderSuccess);
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
        <div className="order-status-styling">
          {orderSuccess.map((item, idx) => {
            return (
              <div>
                <p style={{ textTransform: "capitalize" }}>
                  Table Order {idx + 1} - {item.timestamp}
                </p>

                <Card className="cart-card cart-styling margin-styling">
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
                              style={{ padding: "1.25rem", fontSize: "14px" }}
                              className="body"
                            >
                              {item2.placed_by.name}
                            </Card.Title>
                          ) : (
                            ""
                          )}
                          <Card.Body className="body">
                            {item3.name} - {item3.status}
                          </Card.Body>
                        </div>
                      );
                    });
                  })}
                </Card>
              </div>
            );
          })}
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
