import React from "react";
import AddRemoveItem from "components/AddRemoveItem.js";
import { ReactComponent as PlusSVG } from "assets/plus.svg";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

//used in menu, menu has lots of items
const PlusWithAddRemove = ({ item }) => {
  const {
    dispatch,
    state: { cart }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    showAddRemove: false,
    count: null //if 0,delt effect fires up //maintaining internal state, so that we don't need to pull individual card state from the store
  });


  React.useEffect(() => {
    const idx = cart.findIndex(itm => itm._id.$oid === item._id.$oid);
    if (cart.length > 0 && idx !== -1) {
      setState(state => ({
        ...state,
        quantity: cart[idx].quantity,
        showAddRemove: true
      }));
    }
  }, []);

  //if count is 0, then we show plus button.
  React.useEffect(() => {
    if (state.quantity === 0) {
      setState(state => ({ ...state, showAddRemove: false }));
      dispatch({ type: TYPES.DEL_ITEM, payload: item._id.$oid });
    }
  }, [state.quantity]);

  /*For Internally */
  const decHndlr = () => {
    setState(state => ({ ...state, quantity: --state.quantity }));
  };
  const incHndlr = () => {
    setState(state => ({ ...state, quantity: ++state.quantity }));
  };

  //adds the item to the Store
  //displays the AddRemoveItem
  const onClickPlus = () => {
    dispatch({ type: TYPES.ADD_ITEM, payload: item }); //dispatcing the whole item
    setState(state => ({ ...state, showAddRemove: true, quantity: 1 }));
  };

  return (
    <>
      {state.showAddRemove ? (
        <div style={{ marginRight: "-1rem", float:"right" }}>
          <AddRemoveItem
            id={item._id.$oid}
            count={state.quantity}
            decHndlr={decHndlr}
            incHndlr={incHndlr}
            wrapperStyles={{color:'darkslategrey'}}
            svgClassName="cart-plus-minus-svg"
          />
        </div>
      ) : (
        <PlusSVG className="icon-plus " onClick={onClickPlus} />
      )}
    </>
  );
};

export default PlusWithAddRemove;
