import React from "react";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import { withRouter } from "react-router-dom";
import SearchFoodItems from "components/SearchFoodItems.js";
import Search from "../Pages/Search.js";
const SearchItems = (props) => {
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
    },
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    // inputNode.current.focus();
    //handling refresh issue
  }, []);

  // const [state, setState] = React.useState({
  //   item: "",
  // });
  // const inputNode = React.useRef();

  // const searchValueChange = ({ target: { value } }) => {
  //   inputNode.current.focus();
  //   setState({ item: value });
  //   dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  // };

  const searchHistory = (value) => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true },
    });
  };

  // const searchIconClick = () => {
  //   if (localStorage.getItem("searchItem") !== null) {
  //     let sitems = JSON.parse(localStorage.getItem("searchItem"));
  //     sitems.push(state.item);
  //     localStorage.setItem("searchItem", JSON.stringify(sitems));
  //   } else {
  //     let sitems = [];
  //     sitems.push(state.item);
  //     localStorage.setItem("searchItem", JSON.stringify(sitems));
  //   }
  //   inputNode.current.focus();
  //   dispatch({
  //     type: TYPES.SET_GENERAL_DATA,
  //     payload: { searchClicked: true },
  //   });
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     dispatch({
  //       type: TYPES.SET_GENERAL_DATA,
  //       payload: { searchClicked: true },
  //     });
  //   }
  // };
  return (
    <>
      {searchClicked === true ? (
        <>
          <Search />
          <SearchFoodItems />
        </>
      ) : (
        <div>
          <Search />
          {localStorage.getItem("searchItem") !== null
            ? JSON.parse(localStorage.getItem("searchItem")).map(
                (item, idx) => {
                  return (
                    <div>
                      <div className="search-suggestions">
                        <span
                          className="search-items"
                          onClick={() => searchHistory(item)}
                        >
                          {item}
                        </span>
                      </div>
                    </div>
                  );
                }
              )
            : ""}
        </div>
      )}
    </>
  );
};

export default withRouter(SearchItems);
