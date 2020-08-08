import React from "react";
import { StoreContext } from "Store";
import { ReactComponent as SearchSVG } from "assets/searchIcon3.svg";
import { ReactComponent as CloseSearchSVG } from "assets/closeSearch.svg";
import * as TYPES from "Store/actionTypes.js";
import { withRouter, useLocation } from "react-router-dom";
import "./Search.css";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
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
    closeSearch: false,
  });

  const currentLocation = useLocation().pathname;
  const inputNode = React.useRef();
  React.useEffect(() => {
    if (searchClicked === true) {
      inputNode.current.focus();
      props.history.push("/searchItems");
    }
    //handling refresh issue
  }, [props.history, searchClicked]);

  const searchValueChange = ({ target: { value } }) => {
    props.history.push("/searchItems");
    inputNode.current.focus();

    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true },
    });
    setState({ item: value, closeSearch: true });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: value } });
  };

  // const searchIconClick = () => {
  //   if (localStorage.getItem("searchItem") !== null) {
  //     let sitems = JSON.parse(localStorage.getItem("searchItem"));
  //     if (state.item !== "") {
  //       sitems.push(state.item);
  //       localStorage.setItem("searchItem", JSON.stringify(sitems));
  //     }
  //   } else {
  //     let sitems = [];
  //     if (state.item !== "") {
  //       sitems.push(state.item);

  //       localStorage.setItem("searchItem", JSON.stringify(sitems));
  //     }
  //   }
  //   inputNode.current.focus();
  //   dispatch({
  //     type: TYPES.SET_GENERAL_DATA,
  //     payload: { searchClicked: true },
  //   });
  // };

  const closeButtonClick = () => {
    console.log(currentLocation);
    if (currentLocation === "/searchItems") {
      props.history.goBack();
      console.log("asdf");
      setState({ closeSearch: false });
    } else {
      inputNode.current.blur();
      setState({ closeSearch: false });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch({
        type: TYPES.SET_GENERAL_DATA,
        payload: { searchClicked: true },
      });
    }
  };

  const searchItNow = () => {
    
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: true },
    });
  }

  return (
    <>
      <Container style={{ padding: "1rem" }}>
        <Row style={{ flexWrap: "nowrap" }}>
          <Col xs={10} md={11} style={{ display: "inherit", paddingRight: "0rem" }}>
            <label className="control-label" htmlFor="inputValidation"></label>
            <input
              type="text"
              className="form-control search-bar"
              ref={inputNode}
              autoComplete="off"
              value={searchValue}
              onChange={searchValueChange}
              // onFocus={searchValueChange}
              onKeyDown={handleKeyDown}
              id="inputValidation"
              placeholder="Search the Menu..."
            />
            {/* <span style={{marginTop:"9px"}}>LiQR's App</span> */}
            {state.closeSearch ? (
              <CloseSearchSVG
                onClick={closeButtonClick}
                className="closesearch-bar"
              />
            ) : null}
          </Col>
          <Col xs={2} md={1} style={{padding:"0.4rem"}}>
            <SearchSVG
              onClick={searchItNow}
              className="search-bar-button"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Search);
