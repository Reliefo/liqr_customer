/* eslint-disable */
import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import AddRemoveItem from "components/AddRemoveItem.js";
import { Card, Modal, Button } from "react-bootstrap";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";
import "./FoodItem.css";
import { uniqBy } from "lodash";

const FoodItem = ({ foodItem, index, subsIndex, restOrderingAbility }) => {
  const {
    dispatch,
    state: { cartData, addons, cart, currency },
  } = React.useContext(StoreContext);

  const [show, setShow] = React.useState(false);
  const [newQuantity, setNewQuantity] = React.useState(0);
  const [currentCustomization, setCurrentCustomization] = React.useState([]);

  React.useEffect(() => {
    if (foodItem.hasOwnProperty("customization")) {
      if (currentCustomization.length === 0) {
        let tempCustomization = [];
        foodItem.customization.forEach((cust) => {
          let tempCust = { ...cust };
          tempCust.checked = [];
          var countChecked = tempCust.that_number;
          tempCust.list_of_options.forEach((option) => {
            if (countChecked > 0) {
              tempCust.checked.push(true);
            } else {
              tempCust.checked.push(false);
            }
            countChecked--;
          });

          if (cust.customization_type === "add_ons") {
            tempCust.list_of_options = [];
            cust.list_of_options.forEach((option) => {
              addons.forEach((addon) => {
                if (addon._id.$oid === option) {
                  tempCust.list_of_options.push(addon);
                }
              });
            });
          }

          tempCustomization.push(tempCust);
        });
        setCurrentCustomization(tempCustomization);
      }
    }
  }, [foodItem]);

  const addItem = (foodItem) => {
    let cartItem = _.cloneDeep(foodItem);
    cartItem["currentCustomization"] = _.cloneDeep(currentCustomization);

    dispatch({ type: TYPES.ADD_ITEM, payload: cartItem }); //dispatcing the whole item
    setNewQuantity(1);
    closePopUp(foodItem);
  };

  const addItemDetails = (item, index, subsIndex) => {
    cartData.forEach((item2, index3) => {
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
    dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: cartData });
  };

  const handleClose = () => setShow(false);

  // const setIndex = (foodItem, index, subsIndex) => {
  //   cartData.forEach((item, index3) => {
  //     if (index3 === subsIndex) {
  //       item.food_list.forEach((item1, idx2) => {
  //         if (idx2 === index) {
  //           item1.open = !item1.open;
  //         }
  //       });
  //     }
  //   });
  //   dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: cartData });
  // };

  const closePopUp = (foodItem) => {
    foodItem.showPopup = false;
    // this.forceUpdate();
  };

  const closeDetails = (foodItem, index, subsIndex) => {
    foodItem.showDetails = false;
  };

  const selectDetails = (foodItem, index, subsIndex) => {
    foodItem.showDetails = true;
  };

  let fullDesc = foodItem.description;

  const chooseThemOptions = (custIndex, optionIndex) => {
    var tempCustomization = _.cloneDeep(currentCustomization);
    if (tempCustomization[custIndex].that_number === 1) {
      tempCustomization[custIndex].list_of_options.forEach(
        (option, thisIndex) => {
          tempCustomization[custIndex].checked[thisIndex] = false;
        }
      );
      tempCustomization[custIndex].checked[optionIndex] = true;
    } else {
      tempCustomization[custIndex].checked[optionIndex] = !tempCustomization[
        custIndex
      ].checked[optionIndex];
    }
    setCurrentCustomization(tempCustomization);
  };

  return (
    <Card
      id={foodItem.name}
      style={{
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
                {restOrderingAbility ? (
                  <PlusWithAddRemove
                    foodItem={foodItem}
                    idx={index}
                    subs={subsIndex}
                    quantity={newQuantity}
                    orderingAbility={restOrderingAbility}
                  />
                ) : (
                  <button
                    className="add-button-item"
                    onClick={() => selectDetails(foodItem, index, subsIndex)}
                  >
                    Details
                  </button>
                )}
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
                {restOrderingAbility ? (
                  <PlusWithAddRemove
                    foodItem={foodItem}
                    idx={index}
                    subs={subsIndex}
                    orderingAbility={restOrderingAbility}
                  />
                ) : (
                  <button
                    className="add-button-item"
                    onClick={() => selectDetails(foodItem, index, subsIndex)}
                  >
                    Details
                  </button>
                )}
                {/* <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} /> */}
              </div>
            </div>
          </div>
        )}
        {/* // ) : (
        //   ""
        // )} */}
      </div>
      {foodItem.customization.length > 0 ? (
        <Modal
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

          <Modal.Body style={{ overflowY: "auto" }}>

            {cart.length
              ? cart.map((cartItem) => {
                  if (foodItem._id.$oid === cartItem._id.$oid) {
                    return (
                      <div style={{ display: "flex", marginBottom: "1rem" }}>
                        {cartItem.currentCustomization.map((cartCust) => {
                          if (cartCust.customization_type === "add_ons") {
                            return (
                              <span className="detail-options">
                                {cartCust.list_of_options.map(
                                  (option, optionIndex) => {
                                    if (cartCust.checked[optionIndex]) {
                                      return (
                                        <strong>
                                          {
                                            cartCust.list_of_options[
                                              optionIndex
                                            ].name
                                          }
                                          {", "}
                                        </strong>
                                      );
                                    }
                                  }
                                )}
                              </span>
                            );
                          } else {
                            return (
                              <span className="detail-options">
                                {cartCust.list_of_options.map(
                                  (option, optionIndex) => {
                                    if (cartCust.checked[optionIndex]) {
                                      if (
                                        cartCust.customization_type ===
                                        "options"
                                      ) {
                                        return (
                                          <strong>
                                            {
                                              cartCust.list_of_options[
                                                optionIndex
                                              ].option_name
                                            }
                                            {", "}
                                          </strong>
                                        );
                                      }
                                      if (
                                        cartCust.customization_type ===
                                        "choices"
                                      ) {
                                        return (
                                          <strong>
                                            {
                                              cartCust.list_of_options[
                                                optionIndex
                                              ]
                                            }
                                            {", "}
                                          </strong>
                                        );
                                      }
                                    }
                                  }
                                )}
                              </span>
                            );
                          }
                        })}
                        <p
                          style={{
                            fontSize: ".9rem",
                            float: "left",
                          }}
                        >
                          {cartItem.price}{" "}
                        </p>
                        <AddRemoveItem
                          className="trial-fooditem"
                          count={cartItem.quantity}
                          foodId={cartItem.foodId}
                          allData={cartItem}
                        />
                        {/* <PlusWithAddRemove
                            item={foodItem}
                            idx={index}
                            subs={subsIndex}
                          /> */}
                        <br />
                      </div>
                    );
                  }
                })
              : ""}
                          {true
              ? Object.values(currentCustomization).map((cust, custIndex) => {
                  if (cust.customization_type === "options") {
                    return (
                      <div key={custIndex + "_div"}>
                        {cust.name}
                        {cust.list_of_options.map((option, optionIndex) => {
                          return (
                            <div key={custIndex + "div_key_" + optionIndex}>
                              <label>
                                <input
                                  id={optionIndex}
                                  key={custIndex + "option_key_" + optionIndex}
                                  type="checkbox"
                                  checked={cust.checked[optionIndex]}
                                  onClick={() =>
                                    chooseThemOptions(custIndex, optionIndex)
                                  }
                                  onChange={(e) => {}}
                                  value={option}
                                  name="choicesRadio"
                                />
                                &nbsp;&nbsp;{option.option_name}
                                <p
                                  style={{
                                    display: "inline",
                                    position: "absolute",
                                    right: "2rem",
                                  }}
                                >
                                  {currency} {option.option_price}
                                </p>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  if (cust.customization_type === "choices") {
                    return (
                      <div key={custIndex + "_div"}>
                        {cust.name}
                        {cust.list_of_options.map((option, optionIndex) => {
                          return (
                            <div key={custIndex + "div_key_" + optionIndex}>
                              <label>
                                <input
                                  id={optionIndex}
                                  key={custIndex + "option_key_" + optionIndex}
                                  type="checkbox"
                                  checked={cust.checked[optionIndex]}
                                  onClick={() =>
                                    chooseThemOptions(custIndex, optionIndex)
                                  }
                                  onChange={(e) => {}}
                                  value={option}
                                  name="choicesRadio"
                                />
                                &nbsp;&nbsp;{option}
                                {/* <p
                                  style={{
                                    display: "inline",
                                    position: "absolute",
                                    right: "2rem",
                                  }}
                                >
                                  ₹ {option.option_price}
                                </p> */}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  if (cust.customization_type === "add_ons") {
                    return (
                      <div key={custIndex + "_div"}>
                        {cust.name}
                        {cust.list_of_options.map((option, optionIndex) => {
                          return (
                            <div
                              key={custIndex + "div_key_" + optionIndex}
                              className="addon-item"
                            >
                              <label>
                                <input
                                  id={optionIndex}
                                  key={custIndex + "option_key_" + optionIndex}
                                  type="checkbox"
                                  checked={cust.checked[optionIndex]}
                                  onClick={() =>
                                    chooseThemOptions(custIndex, optionIndex)
                                  }
                                  onChange={(e) => {}}
                                  value={option.name}
                                  name="choicesRadio"
                                />
                                &nbsp;&nbsp;{option.name}
                                <p
                                  style={{
                                    display: "inline",
                                    position: "absolute",
                                    right: "2rem",
                                  }}
                                >
                                  {currency} {option.price}
                                </p>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })
              : ""}
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
              onClick={() => closePopUp(foodItem)}
            >
              Close
            </Button>
            <Button
              className="options-button-add"
              variant="primary"
              onClick={() => addItem(foodItem)}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}

      {foodItem.showDetails && foodItem.showDetails === true ? (
        // {false && foodItem.showDetails === true ? (
        <Modal
          style={{ zIndex: 1420, height: "85%" }}
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
              {foodItem.customization
                ? Object.entries(foodItem.customization).map((item, index) => {
                    // console.log(item[1].customization_type);
                    if (
                      item[1].customization_type === "options" &&
                      item[1].list_of_options.length > 0
                    )
                      return (
                        <div className="capitalize">
                          <br />
                          <div>
                            <b>{item[1].name}</b>
                          </div>
                          {Object.values(item[1].list_of_options).map(
                            (item1, idx) => {
                              console.log(item1);
                              return (
                                <div style={{ textTransform: "capitalize" }}>
                                  {item1.option_name} -{" "}
                                  <b>₹{item1.option_price}</b>
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    if (
                      item[1].customization_type === "choices" &&
                      item[1].list_of_options.length > 0
                    )
                      return (
                        <div className="radio-div-2">
                          <br />
                          <div>
                            <b>{item[1].name}</b>
                          </div>
                          {Object.values(item[1].list_of_options).map(
                            (item1, idx) => {
                              return (
                                <div style={{ textTransform: "capitalize" }}>
                                  {item1}
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    if (
                      item[1].customization_type === "add_ons" &&
                      item[1].list_of_options.length > 0
                    )
                      return (
                        <div className="radio-div-2">
                          <br />
                          <div>
                            <b>{item[1].name}</b>
                          </div>
                          {/* {addons.map((item3) => {
                            return item.list_of_options.map((item2, idx) => {
                              if (item3._id.$oid === item2) { */}
                          {Object.values(item[1].list_of_options).map(
                            (item1, idx) => {
                              return addons.map((addonItem) => {
                                if (addonItem._id.$oid === item1) {
                                  return (
                                    <div
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      <div
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {addonItem.name} -{" "}
                                        <b>₹{addonItem.price}</b>
                                      </div>
                                    </div>
                                  );
                                }
                              });
                            }
                          )}
                        </div>
                      );
                  })
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
                foodItem={foodItem}
                idx={index}
                subs={subsIndex}
                orderingAbility={restOrderingAbility}
              />
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
