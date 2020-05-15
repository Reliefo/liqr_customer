import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import * as TYPES from "Store/actionTypes.js";
import SearchFoodItems from "components/SearchFoodItems.js";
const Search = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
      searchValue,
      activeData
    }
  } = React.useContext(StoreContext);
  const inputNode = React.useRef();
  React.useEffect(() => {
    console.log("Menu screen");

    //handling refresh issue
  }, []);

  const searchValueChange = ({ target: { value } }) => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  };

  const searchIconClick = () => {
    inputNode.current.focus();
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true }
    });
  };
  return (
    <>
      <div>
        <div  class="form-group col-lg-4">
          <div class="form-group has-feedback">
            <label class="control-label" for="inputValidation"></label>
            <input
              type="text"
              class="form-control"
              ref={inputNode}
              value={searchValue}
              onChange={searchValueChange}
              id="inputValidation"
              placeholder="Search the Menu..."
            />
            <SearchSVG onClick={searchIconClick} className="search-svg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
