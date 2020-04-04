import React from "react";
import { ReactComponent as NoodleSVG } from "assets/noodle.svg";
import { ReactComponent as SearchSVG } from "assets/searchIcon.svg";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";

const NavBar = () => {
  //TODO: dynamically change the title
  const [showCollapse, setShowCollapse] = React.useState(false);
  const sideDrawerInner = React.useRef();
  const menuRef = React.useRef();
  const inputNode = React.useRef();

  const {
    dispatch,
    state: { searchClicked, searchValue }
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    //if not in the inside drawer, close the drawer
    const handleClickDrawer = e => {
      if (menuRef.current.contains(e.target)) return;
      if (!sideDrawerInner.current.contains(e.target)) {
        setShowCollapse(false);
      }
    };
    window.document.addEventListener("mousedown", handleClickDrawer);
    return () => {
      window.document.removeEventListener("mousedown", handleClickDrawer);
    };
  }, []);

  const onClickHamburger = () => {
    // if(!showCollapse) return;
    console.log("clicked...");
    setShowCollapse(state => !state);
  };

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
  const closeSearchHndlr = () => {
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
  };
  return (
    <>
      <nav>
        <div
          style={{
            display: searchClicked ? "none" : ""
          }}
        >
          <div
            ref={menuRef}
            className={`hamburger-container ${showCollapse ? "change" : ""}`}
            onClick={onClickHamburger}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          House of Commons
          <SearchSVG onClick={searchIconClick} className="search-svg" />
        </div>
        <div
          className="nav-search-bar"
          style={{ opacity: searchClicked ? 1 : 0 }}
        >
          <input
            ref={inputNode}
            value={searchValue}
            onChange={searchValueChange}
            type="text"
          />
          <span className="ml-3" onClick={closeSearchHndlr}>
            X
          </span>
        </div>
      </nav>
      {/* sideDrawer*/}
      <div
        style={{
          width: showCollapse ? "60%" : 0,
          padding: showCollapse ? "1rem" : 0
        }}
        className="sideDrawer"
        ref={sideDrawerInner}
      >
        <p>Sign Up / In</p>
        {showCollapse && (
          <div
            style={{
              background: "#f6f6f6",
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              margin: "auto"
            }}
          >
            <NoodleSVG height="100px" width="100px" />
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
