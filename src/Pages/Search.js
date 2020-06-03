import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import * as TYPES from "Store/actionTypes.js";
import { Link, withRouter } from "react-router-dom";
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

  const [state, setState] = React.useState({
    item: ""
  });
  const inputNode = React.useRef();
  React.useEffect(() => {
    if (searchClicked === true) {
      inputNode.current.focus();
    }
    //handling refresh issue
  }, []);

  const searchValueChange = ({ target: { value } }) => {
    props.history.push("/searchItems");
    inputNode.current.focus();

    setState({ item: value });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  };

  const searchIconClick = () => {
    if (localStorage.getItem("searchItem") !== null) {
      let sitems = JSON.parse(localStorage.getItem("searchItem"));
      if (state.item !== "") {
        sitems.push(state.item);
        localStorage.setItem("searchItem", JSON.stringify(sitems));
      }
    } else {
      let sitems = [];
      if (state.item !== "") {
        sitems.push(state.item);

        localStorage.setItem("searchItem", JSON.stringify(sitems));
      }
    }
    inputNode.current.focus();
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true }
    });
  };
  return (
    <>
      <div>
        <div class="form-group col-lg-4">
          <div class="form-group has-feedback">
            <label class="control-label" for="inputValidation"></label>
            <input
              type="text"
              class="form-control"
              ref={inputNode}
              autocomplete="off"
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

export default withRouter(Search);
