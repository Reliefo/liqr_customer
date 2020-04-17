import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import { Card, Accordion, Button } from "react-bootstrap";
import * as TYPES from "Store/actionTypes.js";
import dummyPic from "assets/300.png";
import { StoreContext } from "Store";

const FoodItem = ({ foodItem, index, subsIndex, subs }) => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] }
    }
  } = React.useContext(StoreContext);

  const [state] = React.useState({
    food_item: food_menu //0: Personal cart, 1: Table cart
  });

  const setIndex = (foodItem, index, subsIndex) => {
    state.food_item.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.open = !item1.open;
          }
        });
      }
    });
    dispatch({ type: TYPES.UPDATE_FOOD_MENU, payload: state.food_item });
  };

  let desc = foodItem.description.substring(0, 20) + "...";
  return (
    <Accordion defaultActiveKey="0">
      <Card className="category-card food-item">
        <Accordion.Toggle
          onClick={() => setIndex(foodItem, index, subsIndex)}
          variant="link"
          eventKey={index}
        >
          <Card.Title style= {{width: "100%"}}>
              <div>
              <p style={{ float: "left" }}>{foodItem.name}</p>
              <p style={{ float: "right" }}>&#8377; {foodItem.price}</p>
              </div>
          </Card.Title>
        </Accordion.Toggle>
        {foodItem.open && foodItem.open === true ? (
          ""
        ) : (
          <Card.Body className="Menu-body">
            <p style={{ width: "69%", fontSize: ".9rem" }}>
              {desc}
            </p>
            <PlusWithAddRemove item={foodItem} />
          </Card.Body>
        )}
        <Accordion.Collapse eventKey={index}>
          <Card.Body className="Menu-body">
            <p style={{ width: "69%", fontSize: ".9rem" }}>
              {foodItem.description}
            </p>
            <PlusWithAddRemove item={foodItem} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default FoodItem;
