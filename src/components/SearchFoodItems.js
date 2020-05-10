import React from "react";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import FoodItem from "components/FoodItem";

const SearchFoodItems = () => {
  const {
    dispatch,
    state: { searchValue, justMenuItems, activeData }
  } = React.useContext(StoreContext);

  return (
    <div className="category">
      <ul style={{ listStyleType: "none" }}>
        {activeData.map((foodItem, idx) => {
        
          //to make it case insensitive
          return foodItem.food_list.map((data, idx3) => {
          const name = data.name.toLowerCase();
          const mathingValue = searchValue.toLowerCase();
          const isMatch = name.indexOf(mathingValue) !== -1;
          return (
            <li key={idx3} style={{ display: isMatch ? "" : "none" }}>
              <FoodItem
                stateData={activeData}
                foodItem={data}
                subs={foodItem}
                subsIndex={idx}
                index={idx3}
                key={`food-item-${idx3}`}
              />
            </li>
          );
          })
        })}
      </ul>
    </div>
  );
};

export default SearchFoodItems;
