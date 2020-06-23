import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import { ReactComponent as CloseSearchSVG } from "assets/closeSearch.svg";
import * as TYPES from "Store/actionTypes.js";
import { Link, withRouter, useLocation } from "react-router-dom";
import SearchFoodItems from "components/SearchFoodItems.js";
const Search = (props) => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
      searchValue,
      activeData,
    },
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    item: "",
    closeSearch: false
  });

  const currentLocation = useLocation().pathname;
  const inputNode = React.useRef();
  React.useEffect(() => {
    if (searchClicked === true) {
      inputNode.current.focus();
      props.history.push("/searchItems");
    }
    //handling refresh issue
  }, []);

  const searchValueChange = ({ target: { value } }) => {
    props.history.push("/searchItems");
    inputNode.current.focus();

    setState({ item: value, closeSearch: true });
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
      payload: { searchClicked: true },
    });
  };

  const closeButtonClick = () => {
    console.log(currentLocation);
    if (currentLocation == "/searchItems"){
      props.history.goBack();
      console.log('asdf');
      setState({closeSearch: false });
    }
    else{
      inputNode.current.blur();
    setState({closeSearch: false });
    }
  }

  return (
    <>
      <div>
        <div class="form-group col-md-4">
          <div class="form-group has-feedback" style={{ marginTop: "-1.2rem", marginBottom:"0px"}}>
            <label class="control-label" for="inputValidation"></label>
            <input
              type="text"
              class="form-control"
              ref={inputNode}
              autocomplete="off"
              value={searchValue}
              onChange={searchValueChange}
              onFocus={searchValueChange}
              id="inputValidation"
              placeholder="Search the Menu..."
            />
            {/* <input
                type="button"
                value="X"
                className="search-close-button"
                onClick={closeButtonClick}
              /> */}
            {state.closeSearch ? <CloseSearchSVG onClick={closeButtonClick} className="search-svg" /> : null}
            {/* <SearchSVG onClick={searchIconClick} className="search-svg" /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Search);
