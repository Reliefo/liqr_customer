import React from "react";
import AddRemoveItem from "components/AddRemoveItem.js";
import { ReactComponent as PlusSVG } from "assets/plus.svg";
import { Modal, Button } from "react-bootstrap";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

//used in menu, menu has lots of items
const PlusWithAddRemove = ({ item, idx, subs, from }) => {
  const {
    dispatch,
    state: { cart, activeData }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    showAddRemove: false,
    showPlusMinus: false,
    showQuantity: false,
    itemName: item.name,
    count: null //if 0,delt effect fires up //maintaining internal state, so that we don't need to pull individual card state from the store
  });

  React.useEffect(() => {
    item.quantity = 0;
    cart.forEach(nids => {
      if (item._id.$oid === nids._id.$oid) {
        item.quantity += nids.quantity;
      }
    });

    const idx = cart.findIndex(
      itm => itm._id.$oid === item._id.$oid && item.showCustomize === true
    );
    if (cart.length > 0 && idx !== -1) {
      setState(state => ({
        ...state,
        quantity: cart[idx].quantity,
        showAddRemove: true,
        showPlusMinus: true,
        itemName: item.name
      }));
    }

    const nidx = cart.findIndex(
      itm =>
        itm._id.$oid === item._id.$oid &&
        item.foodOptions === true &&
        item.showCustomize === false
    );
    if (cart.length > 0 && nidx !== -1) {
      setState(state => ({
        ...state,
        quantity: cart[nidx].quantity,
        showAddRemove: true,
        showPlusMinus: false,
        showQuantity: true,
        itemName: item.name
      }));
    }

    const ix = cart.findIndex(
      itm => itm._id.$oid === item._id.$oid && item.showCustomize === undefined
    );
    if (cart.length > 0 && ix !== -1) {
      setState(state => ({
        ...state,
        quantity: cart[ix].quantity,
        showAddRemove: true,
        showPlusMinus: true,
        itemName: item.name
      }));
    }
  }, []);

  //if count is 0, then we show plus button.
  React.useEffect(() => {
    if (state.quantity === 0) {
      setState(state => ({ ...state, showAddRemove: false }));

      dispatch({ type: TYPES.DEL_ITEM, payload: item });
    }
  }, [state.quantity]);

  /*For Internally */
  const decHndlr = () => {
    let data = true;
    activeData.forEach((item, index3) => {
      if (index3 === subs) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === idx) {
            if (item1.food_options) {
              item1.foodOptions = true;
              item1.showPopup = true;
              data = false;
            }
          }
        });
      }
    });
    if (data) {
      setState(state => ({ ...state, quantity: --state.quantity }));
    } else {
      setState(state => ({ ...state, quantity: --state.quantity }));
    }
  };
  const incHndlr = () => {
    activeData.forEach((item, index3) => {
      if (index3 === subs) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === idx) {
            if (item1.food_options) {
              item1.foodOptions = true;
              item1.showPopup = true;
            }
          }
        });
      }
    });

    setState(state => ({ ...state, quantity: ++state.quantity }));
  };

  //adds the item to the Store
  //displays the AddRemoveItem
  const onClickPlus = () => {
    let data = true;
    activeData.forEach((item, index3) => {
      if (index3 === subs) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === idx) {
            if (item1.food_options) {
              item1.foodOptions = true;
              item1.showPopup = true;
              data = false;
            }
          }
        });
      }
    });

    activeData.forEach(item => {
      item.food_list.forEach((item1, idx2) => {
        cart.forEach(cartItem => {
          if (cartItem._id.$oid === item1._id.$oid) {
            item1.showCustomize = true;
          }
        });
      });
    });

    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
    if (data) {
      dispatch({ type: TYPES.ADD_ITEM, payload: item }); //dispatcing the whole item
      setState(state => ({
        ...state,
        showAddRemove: true,
        showPlusMinus: true,
        quantity: 1,
        itemName: item.name
      }));
    }
  };

  // console.log("NTEST--->", state)

  return (
    <>
      {state.showQuantity === true ? (
        <button className="add-button-item" onClick={onClickPlus}>
          Add({item.quantity})
        </button>
      ) : state.showAddRemove &&
        state.showPlusMinus &&
        state.itemName === item.name ? (
        <div className="dynamic-button">
          <AddRemoveItem
            id={item}
            allData={item}
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
                ? "options-button-add btn btn-primary"
                : "add-button-item"
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
