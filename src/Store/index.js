import React from "react";
import reducer from "./reducer.js";
import axios from "axios";
import * as TYPES from "./actionTypes";
import tempData from "json_with_class.json";

const initialState = {
  activeNav: "",
  justMenuItems: [], //for search
  searchClicked: false,
  searchValue: "",
  cart: [],
  rawData: {}
};

const StoreContext = React.createContext(null);

const Store = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getData = async () => {
    // try {
    //   const resp = await axios.get();
    //   return resp.data;
    // }catch(err){
    //   return {success: false};
    // }
    
    return tempData;
  };
  React.useEffect(() => {
    console.log("store mounted");

    getData().then(resp => {
      if (!resp.success) {
        dispatch({ type: TYPES.ADD_DATA, payload: resp });
        //segregating the food items and storign for search
        // console.log({ resp });
        let justFoodItems = [];
        const Menu = resp.food_menu;
        for (let i = 0; i < Menu.length; ++i) {
          const Sub = resp.food_menu[i].name;
          for (let j = 0; j < resp.food_menu[i].food_list.length; ++j) {
            justFoodItems.push(resp.food_menu[i].food_list[j])
            // const FoodList = Sub[j].foodlist;
            // for (let k = 0; k < FoodList.length; ++k) {
            //   justFoodItems.push(FoodList[k]);
            // }
          }
        }
        dispatch({
          type: TYPES.ADD_COLLECTIVE_FOODITEMS,
          payload: justFoodItems
        });
      }
    });
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
