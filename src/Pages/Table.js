import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";

import * as TYPES from "Store/actionTypes.js";

const Table = () => {
  const {
    dispatch,
    state: { orderStatus }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    console.log("Table screen");
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });
  }, []);

  return (
    <div>
      {orderStatus.map((item, idx) => {
        return (
          <Card key={idx} className="category-card food-item">
            <Card.Title style={{ width: "100%" }}>{item.payload.food_id}</Card.Title>
          </Card>
        );
      })}
    </div>
  );
};

export default Table;
