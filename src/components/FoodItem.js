import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import { Card, Accordion, Modal, Button, Form } from "react-bootstrap";
import sampleImage from "../assets/300.png";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";

const FoodItem = ({ stateData, foodItem, index, subsIndex, subs }) => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      activeData,
      cart
    }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    food_item: activeData //0: Personal cart, 1: Table cart
  });

  const [show, setShow] = React.useState(false);

  const selectOption = (foodItem, item) => {
    foodItem.food_option = item;
  };
  const selectChoice = (foodItem, item) => {
    foodItem.choice = item;
  };

  const addItem = (item, index, subsIndex) => {
    if (item["options"] === undefined) {
      item["options"] = {};
    }

    if (item["choices"] === undefined) {
      item["choices"] = {};
    }
    item["choices"] = item.choice;
    item["options"] = item.food_option;
    dispatch({ type: TYPES.ADD_ITEM, payload: item }); //dispatcing the whole item

    activeData.forEach((item2, index3) => {
      if (index3 === subsIndex) {
        item2.food_list.forEach((item3, idx2) => {
          if (idx2 === index) {
            item3.showPopup = false;
            item3.showCustomize = false;
            item3.showOptionsAgain = false;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setIndex = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.open = !item1.open;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const closePopUp = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.showPopup = !item1.showPopup;
            item1.showCustomize = false;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const closeDetails = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            delete item1.showDetails;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const selectDetails = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.showDetails = true;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const showOptions = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.showOptionsAgain = true;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };
  return (
    <Card id={foodItem.name} className="category-card food-item">
      <div>
        <div>
          <img className="card-image" src={sampleImage} alt="sample" />
        </div>
        <div style={{ lineHeight: "210%", marginLeft: "2%", width: "80%" }}>
          <p className="item-name">{foodItem.name}</p>
          <div className="options-modal">{foodItem.description}</div>
          <div>
            <p className="item-price">₹ {foodItem.price}</p>
            <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} />
            {/* <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} /> */}
          </div>
          <div
            style={{
              width: "100%",
              float: "left"
            }}
          >
            <p
              style={{
                fontSize: ".9rem",
                textDecoration: "underline"
              }}
              onClick={() => selectDetails(foodItem, index, subsIndex)}
            >
              Details
            </p>
          </div>
        </div>
      </div>
      {/* <Card.Body className="Menu-body">
        <p style={{ width: "69%", fontSize: ".9rem" }}>
          {foodItem.description}
        </p>
        <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} />
      </Card.Body> */}
      {foodItem.foodOptions && foodItem.foodOptions === true ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={foodItem.showPopup}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title className="options-title">
              {foodItem.name} <br />{" "}
              <div className="options-modal">{foodItem.description}</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cart.length
              ? cart.map(item => {
                  if (foodItem._id.$oid === item._id.$oid) {
                    return (
                      <div>
                        <div>
                          <p
                            style={{
                              width: "69%",
                              fontSize: ".9rem",
                              float: "left"
                            }}
                          >
                            Rs{" "}
                            {item.options !== undefined
                              ? item.options.option_price
                              : item.price}{" "}
                            <br />
                            {item.options !== undefined ? Option : ""}
                            {item.options !== undefined
                              ? item.options.option_name
                              : ""}{" "}
                            <br />
                            {item.choices ? "Choice:" : ""} <br />
                            {item.choices ? item.choices : ""} <br />
                          </p>
                          <PlusWithAddRemove
                            item={foodItem}
                            idx={index}
                            subs={subsIndex}
                          />
                          <br />
                        </div>
                      </div>
                    );
                  }
                })
              : ""}
            {foodItem.options
              ? ""
              : Object.entries(foodItem.food_options).map((item, index) => {
                  if (item[0] === "options")
                    return (
                      <div className="radio-div" key={index}>
                        {Object.values(item[1]).map((item1, idx) => {
                          return (
                            <div key={idx}>
                              <label for={item1.option_name}>
                             
                            
                                <Form.Check
                                  id={idx}
                                  onClick={() => selectOption(foodItem, item1)}
                                  type="radio"
                                  label={item1.option_name}
                                  name="optionsRadio"
                                />
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );

                  if (item[0] === "choices" && item[1].length > 0)
                    return (
                      <div className="radio-div-2">
                        <br />
                        Choices
                        {Object.values(item[1]).map((item1, idx) => {
                          return (
                            <div key={idx}>
                              <Form.Check
                                onClick={() => selectChoice(foodItem, item1)}
                                type="radio"
                                label={item1}
                                name="test1"
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                })}
            {foodItem.showCustomize ? (
              <div
                className="modal-customization"
                onClick={() => showOptions(foodItem, index, subsIndex)}
              >
                Add More Customization
              </div>
            ) : (
              ""
            )}
            {foodItem.showOptionsAgain
              ? Object.entries(foodItem.food_options).map((item, index) => {
                  if (item[0] === "options") {
                    return (
                      <div className="radio-div">
                        {Object.values(item[1]).map((item1, idx) => {
                          return (
                            <div key={idx}>
                              <Form.Check
                                onClick={() => selectOption(foodItem, item1)}
                                type="radio"
                                label={item1.option_name}
                                name="test"
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  if (item[0] === "choices" && item[1].length > 0)
                    return (
                      <div className="radio-div-2">
                        <br />
                        Choices
                        {Object.values(item[1]).map((item1, idx) => {
                          return (
                            <div key={idx}>
                              <Form.Check
                                onClick={() => selectChoice(foodItem, item1)}
                                type="radio"
                                label={item1}
                                name="test1"
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                })
              : ""}
            {/* Customizable Options: <br />
            {Object.entries(foodItem.food_options).map((item, index) => {
              return Object.values(item[1]).map((item1, idx) => {
                return (
                  <div key={idx}>
                    <Form.Check
                      onClick={() => selectOption(foodItem, item1)}
                      type="radio"
                      label={item1.option_name}
                      name="test"
                    />
                  </div>
                );
              });
            })} */}
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="options-button-close"
              variant="secondary"
              onClick={() => closePopUp(foodItem, index, subsIndex)}
            >
              Close
            </Button>
            <Button
              className="options-button-add"
              variant="primary"
              onClick={() => addItem(foodItem, index, subsIndex)}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}

      {foodItem.showDetails && foodItem.showDetails === true ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={foodItem.showDetails}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title className="details-title">
              <img className="detailsImage" src={sampleImage} alt="img" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {foodItem.name} <br />{" "}
            <div className="options-modal">{foodItem.description}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="options-button-close"
              variant="secondary"
              onClick={() => closeDetails(foodItem, index, subsIndex)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
    </Card>
  );
};

export default FoodItem;
