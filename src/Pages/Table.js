import React from "react";
import { StoreContext } from "Store";

import * as TYPES from "Store/actionTypes.js";

const Table = () => {
  const { dispatch, state } = React.useContext(StoreContext);

  React.useEffect(() => {
    console.log("Table screen");
      //handling refresh issue
      dispatch({ type: TYPES.SET_NAV, payload: "Table" });
  }, []);

  return (
    <div className="cart-wrapper">

    </div>
  );
};

export default Table;
