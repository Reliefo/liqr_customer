import React from "react";
import reducer from "./reducer.js";

const initialState = {
  activeNav: "",
  justMenuItems: [], //for search
  searchClicked: false,
  tableName: "",
  restName: "",
  searchValue: "",
  cart: [],
  tableId: "",
  menuClick : false,
  fabClick: false,
  phoneRegistered : false,
  restId: "",
  addons: [],
  placeOrderById: "",
  restAddress: "",
  tableCartOrders: [],
  tableUsers: [],
  justBarItems: [],
  dineHistory: [],
  homeItems: [],
  orderSuccess: [],
  orderStatus: [],
  cartData: {},
  rawData: {},
  themeProperties: {},
  // barFoodMenuCats: {},
};

const localState = JSON.parse(sessionStorage.getItem("relief"));

const StoreContext = React.createContext(null);
const Store = props => {
  const [state, dispatch] = React.useReducer(
    reducer,
    localState || initialState
  );

  React.useEffect(() => {
    sessionStorage.setItem("relief", JSON.stringify(state));
  }, [state]);

  // const getData = async () => {
  //   try {
  //     const resp = await axios.get(
  //       "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/rest"
  //     );
  //     return resp.data;
  //   } catch (err) {
  //     return { success: false };
  //   }
  // };
  React.useEffect(() => {
    console.log("store mounted");

    // getData().then(resp => {
    //   if (!resp.success) {
    //     // dispatch({ type: TYPES.ADD_DATA, payload: resp });
    //     // dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: resp.food_menu });
    //     //segregating the food items and storign for search
    //     // console.log({ resp });

    //     // resp.tables.forEach(item => {
    //     //   if (item.users.length > 0) {
    //     //     dispatch({
    //     //       type: TYPES.SET_TABLE_ID,
    //     //       payload: item
    //     //     });

    //     //     dispatch({
    //     //       type: TYPES.SET_PLACEORDER_ID,
    //     //       payload: item
    //     //     });
    //     //   }
    //     // });

    //   }
    // });
  }, []);

  const value = {
    state,
    dispatch
  };
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};
export { StoreContext, Store };
