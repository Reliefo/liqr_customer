import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import smoothScroll from "smoothscroll";
import Search from "./Search.js";
import * as TYPES from "Store/actionTypes.js";
import FoodItem from "components/FoodItem";
import { InputGroup, FormControl } from "react-bootstrap";
import SearchFoodItems from "components/SearchFoodItems.js";
const Menu = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
      activeData
    }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    activeMenu: "food"
  });

  React.useEffect(() => {
    console.log("Menu screen");
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    if (props.location.state && props.location.state.data) {
      let element = document.getElementById(props.location.state.data);
      if (element) {
        smoothScroll(element);
      }
    }
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Menu" });
  }, []);

  const setMenu = (name, type) => {
    setState(state => ({ ...state, activeMenu: name }));
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: type });
  };

  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <>
          <div
            onClick={() => {
              dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
              dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
            }}
          >
            <ul className="menu-btn">
              <li
                className={
                  state.activeMenu === "bar"
                    ? "menu-active bar-active"
                    : "menu-inactive bar-inactive"
                }
                onClick={() => setMenu("bar", bar_menu)}
              >
                <div className="menu-item-names">Bar Menu</div>
              </li>
              <li
                className={
                  state.activeMenu === "food"
                    ? "menu-active food-active"
                    : "food-inactive menu-inactive"
                }
                onClick={() => setMenu("food", food_menu)}
              >
                <div className="menu-item-names">Food Menu</div>
              </li>
            </ul>
            <Search />
            <div className="category">
              {activeData.length &&
                activeData.map((item, idx) => (
                  <React.Fragment key={`Category-${idx}`}>
                    <p className="category-subs" style={{ zIndex: idx + 1 }}>
                      {item.name}
                    </p>

                    <SubCategory
                      activeData={state.activeData}
                      subs={item}
                      categories={idx}
                      key={`category-cards-${idx}`}
                    />
                  </React.Fragment>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Menu;

const SubCategory = ({ subs, categories, activeData }) => (
  <>
    <p
      id={`menu-${categories}`}
      style={{ fontSize: "1.1rem", color: "#334252", fontWeight: 600 }}
    ></p>
    {subs.food_list.map((foodItem, idx3) => (
      <div>
        <FoodItem
          stateData={activeData}
          foodItem={foodItem}
          subs={subs}
          subsIndex={categories}
          index={idx3}
          key={`food-item-${idx3}`}
        />
      </div>
    ))}
  </>
);
