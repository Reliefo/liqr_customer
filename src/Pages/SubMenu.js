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
      rawData: { food_menu = [] },
      themeProperties,
    },
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
    /////THEMEING //////
    if (themeProperties['theme'] === true) {
      let cssVariables = [
        '--theme-font', 
        '--first-menu-background-color', 
        '--second-menu-background-color', 
        '--food-card-color', 
        '--add-button-color', 
      ];
      cssVariables.map((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(item, themeProperties['variables'][item]);
      });
    }
    /////THEMEING //////

  }, []);


  return (
    <>
      <div className="category default-screen">
      <p className="category-subs" style={{zIndex:4}}>
                      {props.location.state.subMenuName}
                    </p>
        {Object.values(props.location.state.data).map((item, index) => {
          return Object.values(props.location.state.foodMenu).map(
            (food, idx) => {
              return Object.values(food.food_list).map((list, ix) => {
                if (list._id.$oid === item) {
                  return (
                    <FoodItem
                      from="home"
                      stateData={props.location.state.foodMenu}
                      foodItem={list}
                      subs={food}
                      subsIndex={idx}
                      index={ix}
                      key={`food-item-${index}`}
                      restOrderingAbility={orderingAbility}
                    />
                  );
                }
              });
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
