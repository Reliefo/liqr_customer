/* eslint-disable */
import React from "react";
import FoodItem from "../components/FoodItem";
import SocketContext from "../socket-context";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

const SubMenu = (props) => {
  const {
    dispatch,
    state: {
      // homeItems,
      // cartData,
      orderingAbility,
      rawData: { food_menu = [], bar_menu = [] },
      themeProperties,
    },
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
    /////THEMEING //////
    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-menu-background-color",
        "--second-menu-background-color",
        "--food-card-color",
        "--add-button-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
    }
    /////THEMEING //////
  }, []);

  return (
    <>
      <div className="category default-screen">
        <p className="category-subs" style={{ zIndex: 4 }}>
          {props.location.state.subMenuName}
        </p>
        {Object.values(props.location.state.data).map((listItem, index) => {
          return Object.values(food_menu.concat(bar_menu)).map(
            (subCategory, idx) => {
              return Object.values(subCategory.food_list).map(
                (foodItem, foodItemIndex) => {
                  if (foodItem._id.$oid === listItem) {
                    return (
                      <FoodItem
                        fromhome="submenu"
                        foodItem={foodItem}
                        subsIndex={idx}
                        index={foodItemIndex}
                        key={`food-item-${index}`}
                        restOrderingAbility={orderingAbility}
                        menuType="food"
                      />
                    );
                  }
                }
              );
            }
          );
        })}
      </div>
    </>
  );
};

const SubMenuWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SubMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SubMenuWithSocket;
