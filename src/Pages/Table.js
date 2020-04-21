import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";

import * as TYPES from "Store/actionTypes.js";

const Table = () => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      orderStatus
    }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    console.log("Table screen");
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });
  }, []);

  return (
    <div className="order-status-styling">
      {food_menu.map((menuItem, index) => {
        return menuItem.food_list.map(foodItem => {
         return orderStatus.map((item, idx) => {
            if (foodItem._id.$oid === item.payload.food_id) {
              return (
                <Card key={idx} className="cart-card cart-styling margin-styling">
                  <Card.Body className="body">
                    {foodItem.name} - {item.payload.type}
                  </Card.Body>
                </Card>
              );
            }
          });
        });
      })}
    </div>
  );
};

export default Table;
