import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon3.svg";
import { ReactComponent as CloseSearchSVG } from "assets/closeSearch.svg";
import * as TYPES from "Store/actionTypes.js";
import { withRouter, useLocation } from "react-router-dom";
const Search = (props) => {
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
      searchValue,
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
  }, [ props.history, searchClicked ]);

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
    if (currentLocation === "/searchItems"){
      props.history.goBack();
      console.log('asdf');
      setState({closeSearch: false });
    }
    else{
      inputNode.current.blur();
    setState({closeSearch: false });
    }
  }
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      dispatch({
        type: TYPES.SET_GENERAL_DATA,
        payload: { searchClicked: true }
      });
    }
  };

  return (
    <>
      <div>
        <div className="form-group col-md-4">
        <div className="form-group has-feedback" style={{ marginTop: "0.7rem", marginBottom:"0px",textAlign:'center'}}>
            <label className="control-label" htmlFor="inputValidation"></label>
            <input
              type="text"
              className="form-control search-bar"
              ref={inputNode}
              autoComplete="off"
              value={searchValue}
              onChange={searchValueChange}
              onFocus={searchValueChange}
              onKeyDown={handleKeyDown}
              id="inputValidation"
              placeholder="Search the Menu..."
            />
            {/* <span style={{marginTop:"9px"}}>LiQR's App</span> */}
            {/* <input
                type="button"
                value="X"
                className="search-close-button"
                onClick={closeButtonClick}
              /> */}
            {state.closeSearch ? <CloseSearchSVG onClick={closeButtonClick} className="closesearch-svg" /> : null}
            <SearchSVG onClick={searchIconClick} className="search-svg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Search);
