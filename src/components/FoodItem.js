/* eslint-disable */
import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import AddRemoveItem from "components/AddRemoveItem.js";
import { Card, Modal, Button } from "react-bootstrap";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";
import "./FoodItem.css";
import "./HomeFoodItem.css";
import { uniqBy } from "lodash";

const FoodItem = ({
  foodItem,
  index,
  subsIndex,
  restOrderingAbility,
  fromhome,
  menuType,
}) => {
  const {
    dispatch,
    state: { cartData, addons, cart, currency },
  } = React.useContext(StoreContext);

  const [currentCustomization, setCurrentCustomization] = React.useState({
    food: [],
    bar: [],
  });
  const [showPopup, setShowPopup] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    if (
      foodItem.hasOwnProperty("customization") &&
      foodItem.customization.length > 0
    ) {
      if (currentCustomization[menuType].length === 0) {
        let tempCustomization = _.cloneDeep(currentCustomization);
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

          tempCustomization[menuType].push(tempCust);
        });
        setCurrentCustomization(tempCustomization);
        foodItem.showCustomize = true;
        cart.forEach((cartItem) => {
          if (foodItem._id.$oid === cartItem._id.$oid) {
            foodItem.showCustomize = false;
          }
        });
      }
    }
  }, [foodItem]);

  const addItem = (foodItem) => {
    let cartItem = _.cloneDeep(foodItem);
    cartItem["currentCustomization"] = _.cloneDeep(
      currentCustomization[menuType]
    );
    let everythingCorrect = true;
    currentCustomization[menuType].forEach((cust) => {
      let selectedNo = 0;
      cust.checked.forEach((check) => {
        if (check) {
          ++selectedNo;
        }
      });
      if (cust.less_more === -1) {
        if (selectedNo > cust.that_number) {
          everythingCorrect = false;
        }
      } else if (cust.less_more === 1) {
        if (selectedNo < cust.that_number) {
          everythingCorrect = false;
        }
      } else if (cust.less_more === 0) {
        if (selectedNo != cust.that_number) {
          everythingCorrect = false;
        }
      }
    });
    if (!everythingCorrect) {
      setShowError(true);
      return;
    }

    dispatch({ type: TYPES.ADD_ITEM, payload: cartItem }); //dispatcing the whole item
    closePopUp(foodItem);
    foodItem.showCustomize = false;
  };

  const closePopUp = (foodItem) => {
    setShowPopup(false);
    setShowError(false);
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
    if (tempCustomization[menuType][custIndex].that_number === 1) {
      tempCustomization[menuType][custIndex].list_of_options.forEach(
        (option, thisIndex) => {
          tempCustomization[menuType][custIndex].checked[thisIndex] = false;
        }
      );
      tempCustomization[menuType][custIndex].checked[optionIndex] = true;
    } else {
      tempCustomization[menuType][custIndex].checked[
        optionIndex
      ] = !tempCustomization[menuType][custIndex].checked[optionIndex];
    }
    setCurrentCustomization(tempCustomization);
  };

  const homeCardOrNot = (fromhome) => {
    return fromhome === "home"
      ? "category-card home-screen-food-card"
      : "category-card food-item";
  };

  const addButton = (restOrderingAbility) => {
    if (restOrderingAbility) {
      return (
        <PlusWithAddRemove
          foodItem={foodItem}
          idx={index}
          subs={subsIndex}
          orderingAbility={restOrderingAbility}
          setShowPopup={setShowPopup}
        />
      );
    } else {
      <button
        className="add-button-item"
        onClick={() => selectDetails(foodItem, index, subsIndex)}
      >
        Details
      </button>;
    }
  };

  return (
    <Card
      id={foodItem.name}
      style={{
        paddingBottom: "0%",
      }}
      className={homeCardOrNot(fromhome)}
    >
      {fromhome === "home" ? (
        <div className="container" style={{ paddingRight: "0rem" }}>
          {foodItem.image_link ? (
            <div className="row">
              <div
                className="col-4 col-5-home-food-card"
                onClick={() => selectDetails(foodItem, index, subsIndex)}
              >
                <img
                  className="card-image-home"
                  src={foodItem.image_link}
                  alt="sample"
                />
              </div>
              <div className={"col-8 col-7-home-food-card"}>
                <div
                  className="row-6 row-6-name"
                  onClick={() => selectDetails(foodItem, index, subsIndex)}
                >
                  <span className="item-name-home">{foodItem.name}</span>
                </div>
                <div className="row-6 row-6-addprice">
                  {/* <div className="food-desc">{fullDesc}</div> */}
                  {/* </div> */}
                  <div className="col-6 col-6-price">
                    <p className="item-price-home">{currency} {foodItem.price}</p>
                  </div>
                  <div className="col-6 col-6-add">
                    <div className="add-button-home">
                      {addButton(restOrderingAbility)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row container-row">
              <div className={"col col-7-home-food-card"}>
                <div className="row-6 row-6-name">
                  <div className="col col-7-home-food-card">
                    <span
                      className="item-name-home"
                      onClick={() => selectDetails(foodItem, index, subsIndex)}
                    >
                      {foodItem.name}
                    </span>
                    <div className="food-desc">{fullDesc}</div>
                  </div>
                </div>
                <div className="row-6 row-6-addprice">
                  <div className="col-6 col-6-price">
                    <p className="item-price-home">{currency} {foodItem.price}</p>
                  </div>
                  <div className="col-6 col-6-add">
                    <div className="add-button-home">
                      {addButton(restOrderingAbility)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container">
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
                  <p className="item-price">{currency} {foodItem.price}</p>
                  {addButton(restOrderingAbility)}
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
                  <p className="item-price">{currency} {foodItem.price}</p>
                  {addButton(restOrderingAbility)}
                  {/* <PlusWithAddRemove item={foodItem} idx={index} subs={subsIndex} /> */}
                </div>
              </div>
            </div>
          )}
          {/* // ) : (
        //   ""
        // )} */}
        </div>
      )}
      {foodItem.customization.length > 0 ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showPopup}
          className="food-options-modal"
        >
          <Modal.Header>
            <Modal.Title className="options-title">
              {foodItem.name}{" "}
              <div className="options-modal">{foodItem.description}</div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ overflowY: "auto" }}>
            <div className="old-customizations">
              {cart.length
                ? cart.map((cartItem, cartItemIndex) => {
                    if (foodItem._id.$oid === cartItem._id.$oid) {
                      return (
                        <div className="old-cust-data" key={"div_"+cartItemIndex}>
                          {cartItem.currentCustomization.map((cartCust, cartCustIndex) => {
                            if (cartCust.customization_type === "add_ons") {
                              return (
                                <span className="old-cust-data-rows" key={cartItemIndex+"_check_"+cartCustIndex}>
                                  {cartCust.list_of_options.map(
                                    (option, optionIndex) => {
                                      if (cartCust.checked[optionIndex]) {
                                        return (
                                          <strong key={cartItemIndex+"_check_"+optionIndex}>
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
                                <span className="old-cust-data-rows">
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
            </div>
            <div className="new-customizations">
              {foodItem.showCustomize ? (
                Object.values(currentCustomization[menuType]).map(
                  (cust, custIndex) => {
                    if (cust.customization_type === "options") {
                      return (
                        <div key={custIndex + "_div"}>
                          {cust.name}
                          <br />
                          <p className="choosing-instructions">
                            {" "}
                            (Please choose{" "}
                            {cust.less_more === -1
                              ? " up-to "
                              : cust.less_more === 0
                              ? "exactly"
                              : "a minimum of "}{" "}
                            {cust.that_number} option/s)
                          </p>
                          {cust.list_of_options.map((option, optionIndex) => {
                            return (
                              <div key={custIndex + "div_key_" + optionIndex}>
                                <label>
                                  <input
                                    id={optionIndex}
                                    key={
                                      custIndex + "option_key_" + optionIndex
                                    }
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
                          <br />
                          <p className="choosing-instructions">
                            {" "}
                            (Please choose{" "}
                            {cust.less_more === -1
                              ? " up-to "
                              : cust.less_more === 0
                              ? "exactly"
                              : "a minimum of "}{" "}
                            {cust.that_number} option/s)
                          </p>
                          {cust.list_of_options.map((option, optionIndex) => {
                            return (
                              <div key={custIndex + "div_key_" + optionIndex}>
                                <label>
                                  <input
                                    id={optionIndex}
                                    key={
                                      custIndex + "option_key_" + optionIndex
                                    }
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
                                  {currency} {option.option_price}
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
                                    key={
                                      custIndex + "option_key_" + optionIndex
                                    }
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
                  }
                )
              ) : (
                // foodItem.showCustomize ? (
                <div
                  className="modal-customization"
                  onClick={() => {
                    foodItem.showCustomize = true;
                  }}
                >
                  Add New Customization
                </div>
              )}
            </div>
          </Modal.Body>
          {showError === true ? (
            <span style={{ textAlign: "center", color: "red" }}>
              Please choose appropriate number of options
            </span>
          ) : (
            ""
          )}
          <Modal.Footer>
            <Button
              className="options-button-close"
              variant="secondary"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Close
            </Button>
            <Button
              className="options-button-add"
              variant="primary"
              onClick={() => {
                foodItem.showCustomize ? addItem(foodItem) : () => {};
              }}
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
              <p style={{ float: "right" }}>{currency} {foodItem.price}</p>
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
                                  <b>{currency}{item1.option_price}</b>
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
                                        <b>{currency}{addonItem.price}</b>
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
                onClick={() => addItem(foodItem, index, subsIndex)}
              >
                Add
              </Button>
            ) : (
              addButton(restOrderingAbility)
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
