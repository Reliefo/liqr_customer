import React from "react";
import { StoreContext } from "Store";
import Search from "../Pages/Search";
import * as TYPES from "Store/actionTypes.js";
import FoodItem from "components/FoodItem";

const SearchFoodItems = () => {
  const {
    dispatch,
    state: { searchValue, justMenuItems, activeData }
  } = React.useContext(StoreContext);

  return (
    <div className="category default-screen">
      <ul style={{ listStyleType: "none" }}>
        {justMenuItems.map((foodItem1, idx9) => {
          return foodItem1.map((foodItem, idx) => {
            return foodItem.food_list.map((data, idx3) => {
              const name = data.name.toLowerCase();
              const mathingValue = searchValue.toLowerCase();
              const isMatch = name.indexOf(mathingValue) !== -1;
              return (
                <li key={idx3} style={{ display: isMatch ? "" : "none" }}>
                  <FoodItem
                    stateData={justMenuItems}
                    foodItem={data}
                    subs={foodItem}
                    subsIndex={idx}
                    index={idx3}
                    key={`food-item-${idx3}`}
                  />
                </li>
              );
            });
          });
        })}
      </ul>
    </div>
  );
};

export default SearchFoodItems;
