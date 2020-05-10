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
  let nidhi = [];
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
      restaurant_id: "BNGHSR0001"
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
  let orderId = [];

  orderSuccess.forEach(item => {
    if (!orderId.includes(item.orders[0].placed_by.$oid)) {
      orderId.push(item.orders[0].placed_by.$oid);
    }
  });

  let orderNames = [];
  tableUsers.forEach(item => {
     orderId.forEach(order => {
       if(order === item.id.$oid) {
        orderNames.push(item.name)
       }
     })
  })
  

  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div className="order-status-styling">
          {orderId.map((id, name) => {
            return (
              <div>
                {orderNames[name]}
            
            {orderSuccess.map((item, idx) => {
              return item.orders.map(item2 => {
                if (item2.placed_by.$oid === id) {
                  return item2.food_list.map((item3, index) => {
                    return (
                      <Card
                        key={index}
                        className="cart-card cart-styling margin-styling"
                      >
                        <Card.Body className="body">
                          {item3.name} - {item3.status}
                        </Card.Body>
                      </Card>
                    );
                  });
                }
              });
            })}
            </div>
            )
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
