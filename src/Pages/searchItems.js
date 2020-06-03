import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import { Card, Row, Col, Form, Modal, Button } from "react-bootstrap";
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

  React.useEffect(() => {
    inputNode.current.focus();

    //handling refresh issue
  }, []);

  const [state, setState] = React.useState({
    item: ""
  });
  const inputNode = React.useRef();

  const searchValueChange = ({ target: { value } }) => {
    inputNode.current.focus();
    setState({ item: value });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  };

  const searchHistory = value => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true }
    });
  };

  const searchIconClick = () => {
    if (localStorage.getItem("searchItem") !== null) {
      let sitems = JSON.parse(localStorage.getItem("searchItem"));
      sitems.push(state.item);
      localStorage.setItem("searchItem", JSON.stringify(sitems));
    } else {
      let sitems = [];
      sitems.push(state.item);
      localStorage.setItem("searchItem", JSON.stringify(sitems));
    }
    inputNode.current.focus();
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true }
    });
  };

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
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div>
          <div class="form-group col-lg-4">
            <div class="form-group has-feedback" style={{ marginTop: "10%" }}>
              <input
                type="button"
                value="<"
                className="back-button"
                onClick={() => props.history.goBack()}
              />
              <input
                type="text"
                style={{
                  width: "77%",
                  marginLeft: "17%"
                }}
                class="form-control"
                ref={inputNode}
                autocomplete="off"
                value={searchValue}
                onKeyDown={handleKeyDown}
                onChange={searchValueChange}
                id="inputValidation"
                placeholder="Search the Menu..."
              />
              <SearchSVG
                style={{ right: "46px" }}
                onClick={searchIconClick}
                className="search-svg"
              />
            </div>
          </div>

          {localStorage.getItem("searchItem") !== null
            ? JSON.parse(localStorage.getItem("searchItem")).map(
                (item, idx) => {
                  return (
                    <div
                      style={{
                        width: "80%",
                        borderBottom: "1px solid",
                        paddingTop: "3%",
                        paddingBottom: "3%",
                        margin: "0 auto"
                      }}
                    >
                      <span
                        className="search-items"
                        onClick={() => searchHistory(item)}
                      >
                        {item}
                      </span>
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

export default withRouter(Search);
