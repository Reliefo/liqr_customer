import React from "react";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import FoodItem from "components/FoodItem";
import SearchFoodItems from "components/SearchFoodItems.js";
const Menu = () => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      searchClicked
    }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    activeMenu: "bar"
  });

  React.useEffect(() => {
    console.log("Menu screen");
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Menu" });
  }, []);

  const setMenu = name => setState(state => ({ ...state, activeMenu: name }));
  


  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <>
          <ul className="menu-btn">
            <li
              className={state.activeMenu === "bar" ? "active" : null}
              onClick={() => setMenu("bar")}
            >
              <div>Bar</div>
            </li>
            <li
              className={state.activeMenu === "food" ? "active" : null}
              onClick={() => setMenu("food")}
            >
              <div>Food</div>
            </li>
          </ul>
          <div className="category">
            {food_menu.length &&
              food_menu.map((item, idx) => (
                <React.Fragment key={`Category-${idx}`}>
                  <p className="category-subs" style={{ zIndex: idx + 1 }}>
                  </p>
                  
                  <SubCategory subs={item} categories = {idx} key={`category-cards-${idx}`} />
                </React.Fragment>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Menu;




const SubCategory = ({ subs, categories }) => (
  <>
    <p id={`menu-${categories}`} style={{ fontSize: "1.1rem", color: "#334252", fontWeight: 600 }}>
      {subs.name}
     </p>
     {subs.food_list.map((foodItem, idx3) => (
       <FoodItem foodItem={foodItem} subs = {subs} subsIndex = {categories} index ={idx3} key={`food-item-${idx3}`}   />
     ))}
  </>
);
