import React from "react";
import AddRemoveItem from "components/AddRemoveItem.js";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import { ReactComponent as MinuSVG } from "assets/minus.svg";
import { ReactComponent as MyPlusSVG } from "assets/myPlus.svg";

//used in menu, menu has lots of items
const PlusWithAddRemove = ({
  foodItem,
  quantity,
  idx,
  subs,
  from,
  fromhome,
  orderingAbility,
}) => {
  const {
    dispatch,
    state: { cart },
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    showPlusMinus: false,
    showQuantity: false,
    count: null, //if 0,delt effect fires up //maintaining internal state, so that we don't need to pull individual card state from the store
  });

  const disablingAddButton = (fromhome) => {
    return orderingAbility === true
      ? homeOrNot(fromhome)
      : homeOrNotDisabled(fromhome);
  };
  const detailsDisablingAdd = () => {
    return orderingAbility === true
      ? "options-button-add btn btn-primary"
      : "options-button-add-disabled btn btn-primary";
  };

  const homeOrNot = (fromhome) => {
    return fromhome === "home" ? "add-button-item" : "add-button-item-menu";
  };
  const homeOrNotDisabled = (fromhome) => {
    return fromhome === "home"
      ? "add-button-item-disabled"
      : "add-button-item-menu-disabled";
  };

  React.useEffect(() => {
    let foodQuantity = 0;
    cart.forEach((cartItem) => {
      if (foodItem._id.$oid === cartItem._id.$oid) {
        foodQuantity += cartItem.quantity;
      }
    });
    setState((state) => ({ ...state, quantity: foodQuantity }));

    const idx = cart.findIndex((itm) => itm._id.$oid === foodItem._id.$oid);
    if (cart.length > 0 && idx !== -1) {
      if (foodItem.customization.length > 0) {
        setState((state) => ({
          ...state,
          showPlusMinus: true,
          showQuantity: true,
        }));
      } else {
        setState((state) => ({
          ...state,
          showPlusMinus: true,
          showQuantity: false,
        }));
      }
    } else {
      setState((state) => ({
        ...state,
        showPlusMinus: false,
      }));
    }
  }, [
    cart,
    foodItem._id.$oid,
    foodItem.foodOptions,
    foodItem.name,
    foodItem.quantity,
    foodItem.showCustomize,
    foodItem.customization.length,
  ]);

  //if count is 0, then we show plus button.
  React.useEffect(() => {
    if (state.quantity === 0) {
      setState((state) => ({ ...state, showAddRemove: false }));

      dispatch({ type: TYPES.DEL_ITEM, payload: foodItem });
    }
  }, [state.quantity, dispatch, foodItem]);

  /*For Internally */
  const decHndlr = () => {
    setState((state) => ({ ...state, quantity: --state.quantity }));
  };
  const incHndlr = () => {
    setState((state) => ({ ...state, quantity: ++state.quantity }));
  };

  //adds the item to the Store
  //displays the AddRemoveItem
  const onClickPlus = () => {
    if (!orderingAbility) {
      return;
    }
    if (foodItem.customization.length > 0) {
      foodItem.showPopup = true;
      return;
    }
    if (foodItem.customization.length > 0) {
      setState((state) => ({
        ...state,
        quantity: 1,
        showPlusMinus: true,
        showQuantity: true,
      }));
    } else {
      setState((state) => ({
        ...state,
        quantity: 1,
        showPlusMinus: true,
        showQuantity: false,
      }));
    }
    dispatch({ type: TYPES.ADD_ITEM, payload: foodItem }); //dispatcing the whole foodItem
  };

  return (
    <>
      {state.showQuantity === true && state.showPlusMinus === true ? (
        // <button className={disablingAddButton(fromhome)} onClick={onClickPlus}>
        //   Add ({state.quantity})
        // </button>
        <div className="dynamic-button">
          <div
            // className={`d-flex ${props.className}`}
            className="d-flex"
            style={{ fontWeight: 600 }}
          >
            <div className="icon">
              <MinuSVG onClick={onClickPlus} className="cart-plus-minus-svg" />
            </div>
            {state.quantity}
            <div className="icon">
              <MyPlusSVG onClick={onClickPlus} className="cart-plus-minus-svg" />
            </div>
          </div>
        </div>
      ) : state.showPlusMinus ? (
        <div className="dynamic-button">
          <AddRemoveItem
            foodId={foodItem._id.$oid}
            allData={foodItem}
            count={state.quantity}
            decHndlr={decHndlr}
            incHndlr={incHndlr}
            wrapperStyles={{ color: "#ffb023" }}
            svgClassName="cart-plus-minus-svg"
          />
        </div>
      ) : (
        <div>
          <button
            className={
              from === "details"
                ? detailsDisablingAdd()
                : disablingAddButton(fromhome)
            }
            onClick={onClickPlus}
          >
            Add
          </button>
        </div>
      )}
    </>
  );
};

export default PlusWithAddRemove;
