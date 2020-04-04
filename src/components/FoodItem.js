import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import { Card } from "react-bootstrap";

const FoodItem = ({ foodItem }) => {
  return (
    <Card className="category-card food-item">
      <Card.Title>
        <p style={{ width: "69%" }}>{foodItem.name}</p>
        <p>&#8377; {foodItem.price}</p>
      </Card.Title>
      <Card.Body className="Menu-body">
        <p style={{ width: "69%", fontSize: ".9rem" }}>
          {foodItem.description}
        </p>
        <PlusWithAddRemove item={foodItem} />
      </Card.Body>
    </Card>
  );
};

export default FoodItem;
