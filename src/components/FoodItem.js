import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import AddRemoveItem from "components/AddRemoveItem.js";
import { Card, Accordion, Modal, Button, Form } from "react-bootstrap";
import sampleImage from "../assets/300.png";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";

const FoodItem = ({ stateData, foodItem, index, subsIndex, subs, from }) => {
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

    let flag = false;
    if (item.food_option !== undefined) {
      item["options"] = item.food_option;
      flag = true;
    }

    if (item.choice !== undefined) {
      item["choices"] = item.choice;
      flag = true;
    }

    if (flag === false) {
      activeData.forEach((item2, index3) => {
        if (index3 === subsIndex) {
          item2.food_list.forEach((item3, idx2) => {
            if (idx2 === index) {
              item3.showError = true;
              delete item3.options;
              delete item3.food_option;
              delete item3.choice;
              delete item3.choices;
            }
          });
        }
      });
      dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
    } else {
      item["choices"] = item.choice;
      item["options"] = item.food_option;
      dispatch({ type: TYPES.ADD_ITEM, payload: item }); //dispatcing the whole item

      activeData.forEach((item2, index3) => {
        if (index3 === subsIndex) {
          item2.food_list.forEach((item3, idx2) => {
            if (idx2 === index) {
              delete item3.showError;
              item3.showPopup = false;
              item3.showCustomize = false;
              delete item3.food_option;
              delete item3.choice;
              item3.showOptionsAgain = false;
            }
          });
        }
      });
      dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
    }
  };

  const addItemDetails = (item, index, subsIndex) => {
    activeData.forEach((item2, index3) => {
      if (index3 === subsIndex) {
        item2.food_list.forEach((item3, idx2) => {
          if (idx2 === index) {
            console.log("item3", item3);
            item3.showDetails = false;
            item3.foodOptions = true;
            item3.showPopup = true;
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
            delete item1.food_option;
            delete item1.choice;
            delete item1.showError;
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

  let desc = foodItem.description.substring(0, 40) + "...";

  return (
    <Card id={foodItem.name} className="category-card food-item">
      <div>
        <div>
          {foodItem.image_link ? (
            <img
              style={from === "home" ? { height: "100%" } : { height: "100px" }}
              className="card-image"
              src={foodItem.image_link}
              alt="sample"
            />
          ) : (
            ""
          )}
        </div>
        <div
          style={
            from === "home"
              ? foodItem.image_link
                ? { lineHeight: "155%", marginLeft: "2%", width: "80%" }
                : { lineHeight: "210%", marginLeft: "2%", width: "80%" }
              : { lineHeight: "210%", marginLeft: "2%", width: "100%" }
          }
        >
          <p className="item-name">{foodItem.name}</p>
          <div className="options-modal">{desc}</div>
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
                width: "30%",
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
          style={{ zIndex: 10000 }}
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

          <Modal.Body style={{ "overflow-y": "auto" }}>
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
                            ₹{" "}
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
                          <AddRemoveItem
                            className="trial-fooditem"
                            count={item.quantity}
                            id={item}
                            allData={item}
                          />
                          {/* <PlusWithAddRemove
                            item={foodItem}
                            idx={index}
                            subs={subsIndex}
                          /> */}
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
                          let count = 0;

                          Object.values(item[1]).forEach((val, checkIndex) => {
                            if (val.checked === true) {
                              count++;
                              item1.indexSelected = checkIndex;
                            }
                          });

                          if (count === 0) {
                            if (idx === 0) {
                              item1.checked = true;
                              selectOption(foodItem, item1);
                            }
                          }

                          if (idx === item1.indexSelected) {
                            item1.checked = true;
                            selectOption(foodItem, item1);
                          }

                          const checkIndexValue = index => {
                            Object.values(item[1]).forEach(
                              (val, checkIndex) => {
                                if (index === checkIndex) {
                                  val.checked = true;
                                  selectOption(foodItem, val);
                                } else {
                                  val.checked = false;
                                }
                              }
                            );
                          };

                          return (
                            <div key={idx}>
                              <label>
                                <input
                                  id={idx}
                                  type="radio"
                                  checked={item1.checked}
                                  onClick={() => checkIndexValue(idx)}
                                  value={item1.option_name}
                                  name="optionsRadio"
                                />
                                &nbsp;&nbsp;{item1.option_name}
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
                          let selectedChoice = foodItem.indexSelected;
                          if (selectedChoice === undefined) {
                            selectedChoice = 0;
                            foodItem.indexSelected = 0;
                            foodItem.choiceSelected = true;
                            selectChoice(foodItem, item1);
                          }

                          const checkChoiceIndexValue = index => {
                            selectedChoice = index;
                            foodItem.indexSelected = index;

                            Object.values(item[1]).forEach(
                              (val, checkIndex) => {
                                if (index === checkIndex) {
                                  selectChoice(foodItem, val);
                                }
                              }
                            );
                          };

                          return (
                            <div key={idx}>
                              <label>
                                <input
                                  id={idx}
                                  type="radio"
                                  checked={idx === selectedChoice}
                                  onClick={() => checkChoiceIndexValue(idx)}
                                  value={item1}
                                  name="choiceRadio"
                                />
                                &nbsp;&nbsp;{item1}
                              </label>
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
                          let count = 0;

                          Object.values(item[1]).forEach((val, checkIndex) => {
                            if (val.checked === true) {
                              count++;
                              item1.indexSelected = checkIndex;
                            }
                          });

                          if (count === 0) {
                            if (idx === 0) {
                              item1.checked = true;
                              selectOption(foodItem, item1);
                            }
                          }

                          if (idx === item1.indexSelected) {
                            item1.checked = true;
                            selectOption(foodItem, item1);
                          }

                          const checkIndexValueAgain = index => {
                            Object.values(item[1]).forEach(
                              (val, checkIndex) => {
                                if (index === checkIndex) {
                                  val.checked = true;
                                  selectOption(foodItem, val);
                                } else {
                                  val.checked = false;
                                }
                              }
                            );
                          };

                          return (
                            <div key={idx}>
                              <label>
                                <input
                                  id={idx}
                                  type="radio"
                                  checked={item1.checked}
                                  onClick={() => checkIndexValueAgain(idx)}
                                  value={item1.option_name}
                                  name="test"
                                />
                                &nbsp;&nbsp;{item1.option_name}
                              </label>
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
                          let selectedChoice = foodItem.indexSelected1;
                          if (selectedChoice === undefined) {
                            selectedChoice = 0;
                            foodItem.indexSelected1 = 0;
                            foodItem.choiceSelected1 = true;
                            selectChoice(foodItem, item1);
                          }

                          const checkChoiceIndexValueAgain = index => {
                            selectedChoice = index;
                            foodItem.indexSelected1 = index;

                            Object.values(item[1]).forEach(
                              (val, checkIndex) => {
                                if (index === checkIndex) {
                                  selectChoice(foodItem, val);
                                }
                              }
                            );
                          };
                          return (
                            <div key={idx}>
                              <label>
                                <input
                                  id={idx}
                                  type="radio"
                                  checked={idx === selectedChoice}
                                  onClick={() =>
                                    checkChoiceIndexValueAgain(idx)
                                  }
                                  label={item1}
                                  name="test1"
                                />
                                &nbsp;&nbsp;{item1}
                              </label>
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
          {foodItem.showError === true ? (
            <span style={{ textAlign: "center", color: "red" }}>
              Please Select an Option / Choice
            </span>
          ) : (
            ""
          )}
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
          style={{ zIndex: 10000 }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={foodItem.showDetails}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title className="details-title">
              {foodItem.image_link ? (
                <img
                  className="detailsImage"
                  src={foodItem.image_link}
                  alt="img"
                />
              ) : (
                ""
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ float: "left" }}> {foodItem.name}</p>{" "}
            <b>
              <p style={{ float: "right" }}>₹ {foodItem.price}</p>
            </b>
            <div>
              <div
                style={{ float: "left", width: "100%", paddingBottom: "2%" }}
                className="options-modal"
              >
                {foodItem.description}
              </div>
            </div>
            <br />
            <div className="options-modal" style={{ float: "left" }}>
              {foodItem.food_options ? (
                foodItem.food_options.options ? (
                  <b> Options:</b>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <br />
              {foodItem.food_options
                ? foodItem.food_options.options
                  ? Object.entries(foodItem.food_options).map((item, index) => {
                      if (item[0] === "options")
                        return Object.values(item[1]).map((item1, idx) => {
                          return (
                            <div style={{ textTransform: "capitalize" }}>
                              {item1.option_name} - <b>₹{item1.option_price}</b>
                            </div>
                          );
                        });
                      if (item[0] === "choices" && item[1].length > 0)
                        return (
                          <div className="radio-div-2">
                            <br />
                            Choices
                            {Object.values(item[1]).map((item1, idx) => {
                              return (
                                <div style={{ textTransform: "capitalize" }}>
                                  {item1}
                                </div>
                              );
                            })}
                          </div>
                        );
                    })
                  : ""
                : ""}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="options-button-close"
              variant="secondary"
              onClick={() => closeDetails(foodItem, index, subsIndex)}
            >
              Close
            </Button>
            {foodItem.foodOptions ? (
              <Button
                className="options-button-add"
                variant="primary"
                onClick={() => addItemDetails(foodItem, index, subsIndex)}
              >
                Add
              </Button>
            ) : (
              <PlusWithAddRemove from= "details" item={foodItem} idx={index} subs={subsIndex} />
            )}
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
    </Card>
  );
};

export default FoodItem;
