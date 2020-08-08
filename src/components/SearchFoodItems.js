import React from "react";
import { StoreContext } from "Store";
import FoodItem from "components/FoodItem";

const SearchFoodItems = () => {
  const {
    // dispatch,
    state: {
      searchValue,
      orderingAbility,
      rawData: { food_menu = [], bar_menu = [] },
    },
  } = React.useContext(StoreContext);

  return (
    <div className="category default-screen">
      <ul style={{ listStyleType: "none" }}>
        {food_menu.concat(bar_menu).map((category, categoryIdx) => {
          return category.food_list.map((foodItem, foodItemIdx) => {
            const name = foodItem.name.toLowerCase();
            const mathingValue = searchValue.toLowerCase();
            const isMatch = name.indexOf(mathingValue) !== -1;
            return (
              <li
                key={categoryIdx + "_" + foodItemIdx}
                style={{ display: isMatch ? "" : "none" }}
              >
                <FoodItem
                  foodItem={foodItem}
                  subs={foodItem}
                  subsIndex={categoryIdx}
                  index={foodItemIdx}
                  key={`food-item-${foodItemIdx}`}
                  restOrderingAbility={orderingAbility}
                  menuType="food"
                />
              </li>
            );
          });
        })}
      </ul>
    </div>
  );
};

export default SearchFoodItems;
