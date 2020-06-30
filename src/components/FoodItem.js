import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import AddRemoveItem from "components/AddRemoveItem.js";
import { Card, Accordion, Modal, Button, Form } from "react-bootstrap";
import sampleImage from "../assets/300.png";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";
import "./FoodItem.scss";
import { uniqBy } from "lodash";

const FoodItem = ({ stateData, foodItem, index, subsIndex, subs, from }) => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      activeData,
      addons,
      cart,
    },
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    food_item: activeData, //0: Personal cart, 1: Table cart
  });

  const [show, setShow] = React.useState(false);
  const [choicesSelected, setChoicesSelected] = React.useState([]);
  const [numberOfChoices, setNumberOfChoices] = React.useState(0);
  const [choices, setChoices] = React.useState(null);

  React.useEffect(() => {
    if (foodItem.hasOwnProperty("choice") && foodItem.choice !== "") {
      const clonedChoices = [...choicesSelected];
      clonedChoices.push(foodItem.choice);
      setChoicesSelected(clonedChoices);
    }

    if (foodItem.hasOwnProperty("customization")) {
      let choicesObject = {};
      foodItem.customization.forEach((item) => {
        if (item.customization_type === "choices") {
          setNumberOfChoices(item.that_number);
          choicesObject[item.name] = {
            toCount: item.that_number,
            items: [],
          };
          if (item.list_of_options.length > 0) {
            choicesObject[item.name].items.push(item.list_of_options[0]);
          }
        }
      });
      setChoices(choicesObject);
    }
  }, [foodItem]);

  const selectOption = (foodItem, item) => {
    foodItem.food_option = item;
  };

  const selectAddon = (foodItem, item, addonItem) => {
    let items = "";

    if (foodItem.addons === undefined) {
      foodItem.addons = [];
    }

    foodItem.addons.forEach((item3) => {
      items += item3 + ",";
    });

    if (!items.includes(item)) {
      foodItem.addons.push(addonItem);
    }
  };

  const selectChoice = (foodItem, choice, customizationItem) => {
    foodItem.choice = choice;

    const clonedChoices = { ...choices };
    const currentItem = clonedChoices[customizationItem.name];
    const index = currentItem.items.indexOf(choice);
    const items = [...currentItem.items];
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(choice);
    }

    if (items.length <= currentItem.toCount) {
      currentItem.items = items;
      clonedChoices[customizationItem.name] = currentItem;
      setChoices(clonedChoices);
    }
  };

  const fetchSelectedChoices = () => {
    const selectedChoices = [];
    for (let key in choices) {
      selectedChoices.push(...choices[key].items);
    }
    return selectedChoices;
  };

  const addItem = (item, index, subsIndex) => {
    if (item["options"] === undefined) {
      item["options"] = {};
    }

    if (item["choices"] === undefined) {
      item["choices"] = {};
    }

    if (item["addon"] === undefined) {
      item["addon"] = [];
    }

    let flag = false;
    if (item.food_option !== undefined) {
      item["options"] = item.food_option;
      flag = true;
    }

    if (item.choice !== undefined) {
      item["choices"] = fetchSelectedChoices();
      flag = true;
    }

    if (item.addons !== undefined) {
      item["addon"] = uniqBy(item.addons, (e) => {
        return e.hasOwnProperty("_id") ? e._id.$oid : e;
      });
      flag = true;
    }

    // console.log("NIDS--->", item);

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
      item["choices"] = fetchSelectedChoices();
      item["options"] = item.food_option;
      item["add_ons"] = uniqBy(item.addon, (e) => {
        return e.hasOwnProperty("_id") ? e._id.$oid : e;
      });
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
  let desc = foodItem.description
    ? foodItem.description.substring(0, 40) + "..."
    : "";
  let fullDesc = foodItem.description;

  let visibility = foodItem.visibility;

  // if (foodItem.customization.length > 0){
  //   console.log('true');
  // }
  // console.log(foodItem.customization);

  return (
    // {from == "home" ?
    <Card
      id={foodItem.name}
      style={{
        // width: "90%",
        paddingBottom: "0%",
      }}
      className="category-card food-item"
    >
      <div className="container">
        {/* {foodItem.image_link ? ( */}
        {foodItem.image_link ? (
          <div className="row container-row-home">
            <div
              className="col-3 col-5-menu-food-card"
              onClick={() => selectDetails(foodItem, index, subsIndex)}
            >
              <img
                className="card-image-menu"
                src={foodItem.image_link}
                alt="sample"
              />
            </div>
            <div className={"col-9 col-7-menu-food-card"}>
              <div onClick={() => selectDetails(foodItem, index, subsIndex)}>
                <p className="item-name-menu">{foodItem.name}</p>
              </div>
              <div className="food-desc-menu">{fullDesc}</div>
              <div>
                <p className="item-price">₹ {foodItem.price}</p>
                <PlusWithAddRemove
                  item={foodItem}
                  idx={index}
                  subs={subsIndex}
                />
                {/* <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} /> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className={"col"}>
              <div onClick={() => selectDetails(foodItem, index, subsIndex)}>
                <p className="item-name-menu">{foodItem.name}</p>
              </div>
              <div className="food-desc-menu">{fullDesc}</div>
              <div>
                <p className="item-price">₹ {foodItem.price}</p>
                <PlusWithAddRemove
                  item={foodItem}
                  idx={index}
                  subs={subsIndex}
                />
                {/* <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} /> */}
              </div>
            </div>
          </div>
        )}
        {/* // ) : (
        //   ""
        // )} */}
      </div>
      {/* <Card.Body className="Menu-body">
        <p style={{ width: "69%", fontSize: ".9rem" }}>
          {foodItem.description}
        </p>
        <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} />
      </Card.Body> */}
      {foodItem.customization.length > 0 && foodItem.foodOptions === true ? (
        <Modal
          style={{ zIndex: 10000 }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={foodItem.showPopup}
          onHide={handleClose}
          className="food-options-modal"
        >
          <Modal.Header>
            <Modal.Title className="options-title">
              {foodItem.name}{" "}
              <div className="options-modal">{foodItem.description}</div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ "overflow-y": "auto" }}>
            {cart.length
              ? cart.map((item) => {
                  if (foodItem._id.$oid === item._id.$oid) {
                    return (
                      <div>
                        <div>
                          <p
                            style={{
                              width: "69%",
                              fontSize: ".9rem",
                              float: "left",
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
            {
              foodItem.options
                ? ""
                : Object.values(foodItem.customization).map((item, index) => {
                    if (item.customization_type === "options") {
                      return (
                        <div>
                          {item.name}
                          {item.list_of_options.map((item2, idx) => {
                            let count = 0;

                            item.list_of_options.forEach((val, checkIndex) => {
                              if (val.checked === true) {
                                count++;
                                item2.indexSelected = checkIndex;
                              }
                            });

                            if (count === 0) {
                              if (idx === 0) {
                                item2.checked = true;
                                selectOption(foodItem, item2);
                              }
                            }

                            if (idx === item2.indexSelected) {
                              item2.checked = true;
                              selectOption(foodItem, item2);
                            }

                            const checkIndexValue = (index) => {
                              item.list_of_options.forEach(
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
                              <div key={idx} className="addon-item">
                                <label>
                                  <input
                                    id={idx}
                                    type="checkbox"
                                    checked={item2.checked}
                                    onClick={() => checkIndexValue(idx)}
                                    value={item2.option_name}
                                    name="optionsRadio"
                                  />
                                  &nbsp;&nbsp;{item2.option_name}
                                </label>
                                <p>₹ {item2.option_price}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    if (item.customization_type === "choices") {
                      return (
                        <div>
                          {item.name}
                          {item.list_of_options.map((item2, idx) => {
                            let selectedChoice = foodItem.indexSelected;
                            if (selectedChoice === undefined) {
                              selectedChoice = 0;
                              foodItem.indexSelected = 0;
                              foodItem.choiceSelected = true;
                              selectChoice(foodItem, item2, item);
                            }

                            const checkChoiceIndexValue = (index) => {
                              selectedChoice = index;
                              foodItem.indexSelected = index;

                              item.list_of_options.forEach(
                                (val, checkIndex) => {
                                  if (index === checkIndex) {
                                    selectChoice(foodItem, val, item);
                                  }
                                }
                              );
                            };
                            return (
                              <div key={idx}>
                                <label>
                                  <input
                                    id={idx}
                                    type="checkbox"
                                    checked={
                                      choices &&
                                      choices[item.name].items.indexOf(
                                        item2
                                      ) !== -1
                                    }
                                    onClick={() => checkChoiceIndexValue(idx)}
                                    value={item2}
                                    name="choicesRadio"
                                  />
                                  &nbsp;&nbsp;{item2}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    if (item.customization_type === "add_ons") {
                      return (
                        <div>
                          {item.name}
                          {addons.map((item3) => {
                            return item.list_of_options.map((item2, idx) => {
                              if (item3._id.$oid === item2) {
                                return (
                                  <div key={idx} className="addon-item">
                                    <label>
                                      <input
                                        id={idx}
                                        type="checkbox"
                                        // checked={item1.checked}
                                        onClick={() =>
                                          selectAddon(foodItem, item2, item3)
                                        }
                                        // value={item1.option_name}
                                        name="choicesRadio"
                                      />
                                      &nbsp;&nbsp;
                                      {item3._id.$oid === item2
                                        ? item3.name
                                        : ""}
                                    </label>
                                    <p>₹ {item3.price}</p>
                                  </div>
                                );
                              }
                            });
                          })}
                        </div>
                      );
                    }
                  })
              // : Object.entries(foodItem.food_options).map((item, index) => {
              //   if (item[0] === "options")
              //     return (
              //       <div className="radio-div" key={index}>
              //         {Object.values(item[1]).map((item1, idx) => {
              //           let count = 0;

              //           Object.values(item[1]).forEach((val, checkIndex) => {
              //             if (val.checked === true) {
              //               count++;
              //               item1.indexSelected = checkIndex;
              //             }
              //           });

              //           if (count === 0) {
              //             if (idx === 0) {
              //               item1.checked = true;
              //               selectOption(foodItem, item1);
              //             }
              //           }

              //           if (idx === item1.indexSelected) {
              //             item1.checked = true;
              //             selectOption(foodItem, item1);
              //           }

              //           const checkIndexValue = index => {
              //             Object.values(item[1]).forEach(
              //               (val, checkIndex) => {
              //                 if (index === checkIndex) {
              //                   val.checked = true;
              //                   selectOption(foodItem, val);
              //                 } else {
              //                   val.checked = false;
              //                 }
              //               }
              //             );
              //           };

              //           return (
              //             <div key={idx}>
              //               <label>
              //                 <input
              //                   id={idx}
              //                   type="radio"
              //                   checked={item1.checked}
              //                   onClick={() => checkIndexValue(idx)}
              //                   value={item1.option_name}
              //                   name="optionsRadio"
              //                 />
              //                   &nbsp;&nbsp;{item1.option_name}
              //               </label>
              //             </div>
              //           );
              //         })}
              //       </div>
              //     );

              //   if (item[0] === "choices" && item[1].length > 0)
              //     return (
              //       <div className="radio-div-2">
              //         <br />
              //           Choices
              //         {Object.values(item[1]).map((item1, idx) => {
              //           let selectedChoice = foodItem.indexSelected;
              //           if (selectedChoice === undefined) {
              //             selectedChoice = 0;
              //             foodItem.indexSelected = 0;
              //             foodItem.choiceSelected = true;
              //             selectChoice(foodItem, item1);
              //           }

              //           const checkChoiceIndexValue = index => {
              //             selectedChoice = index;
              //             foodItem.indexSelected = index;

              //             Object.values(item[1]).forEach(
              //               (val, checkIndex) => {
              //                 if (index === checkIndex) {
              //                   selectChoice(foodItem, val);
              //                 }
              //               }
              //             );
              //           };

              //           return (
              //             <div key={idx}>
              //               <label>
              //                 <input
              //                   id={idx}
              //                   type="radio"
              //                   checked={idx === selectedChoice}
              //                   onClick={() => checkChoiceIndexValue(idx)}
              //                   value={item1}
              //                   name="choiceRadio"
              //                 />
              //                   &nbsp;&nbsp;{item1}
              //               </label>
              //             </div>
              //           );
              //         })}
              //       </div>
              //     );
              // })
            }
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

                          const checkIndexValueAgain = (index) => {
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

                          const checkChoiceIndexValueAgain = (index) => {
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
              {/* {foodItem.food_options ? (
                foodItem.food_options.options ? (
                  <b> Options:</b>
                ) : (
                    ""
                  )
              ) : (
                  ""
                )} */}
              <br />
              {foodItem.food_options
                ? foodItem.customization
                  ? ""
                  : // ? Object.entries(foodItem.food_options).map((item, index) => {
                    //   if (item[0] === "options")
                    //     return Object.values(item[1]).map((item1, idx) => {
                    //       return (
                    //         <div style={{ textTransform: "capitalize" }}>
                    //           {item1.option_name} - <b>₹{item1.option_price}</b>
                    //         </div>
                    //       );
                    //     });
                    //   if (item[0] === "choices" && item[1].length > 0)
                    //     return (
                    //       <div className="radio-div-2">
                    //         <br />
                    //           Choices
                    //         {Object.values(item[1]).map((item1, idx) => {
                    //           return (
                    //             <div style={{ textTransform: "capitalize" }}>
                    //               {item1}
                    //             </div>
                    //           );
                    //         })}
                    //       </div>
                    //     );
                    // })
                    ""
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
              <PlusWithAddRemove
                from="details"
                item={foodItem}
                idx={index}
                subs={subsIndex}
              />
            )}
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
    </Card>
    // :

    //   <Card></Card> }
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
    /*:*/
   /*:*/);
};

export default FoodItem;
