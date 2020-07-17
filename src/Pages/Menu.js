/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import smoothScroll from "smoothscroll";
import * as TYPES from "Store/actionTypes.js";
import SocketContext from "../socket-context";
import FoodItem from "components/FoodItem";
import { Modal, Button } from "react-bootstrap";
import SearchFoodItems from "components/SearchFoodItems.js";
import classnames from "classnames";
import "../components/NavBar.css";
import "./Menu.css";

const Menu = (props) => {
  const [prevScrollpos, setPrevScrollpos] = React.useState(window.pageYOffset);
  const [visible, setVisible] = React.useState(true);
  const {
    dispatch,
    state: {
      rawData: { food_menu = [], bar_menu = [] },
      searchClicked,
      orderingAbility,
      restId,
      themeProperties,
      currentMenu,
    },
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    activeMenu: "food",
    showData: true,
  });

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    // const visible = prevScrollpos > currentScrollPos;
    setPrevScrollpos((prevScrollpos) => currentScrollPos);
    // setVisible(visible);
  };
  React.useEffect(() => {
    // if (props.socket.connected === false) {
    //   axios({
    //     method: "post",
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
    //     },
    //     url: "https://liqr.cc/refresh"
    //   }).then(response => {
    //     const { data } = response;
    //     setTimeout(function() {
    //       if (props.socket.connected === false) {
    //         localStorage.setItem("jwt", data.access_token);
    //         localStorage.setItem("restaurant_id", data.restaurant_id);
    //         //Start the timer
    //         ReactDOM.render(<AppWrapper />, document.getElementById("root"));
    //       }
    //     }, 2000);
    //   });
    // }

    /////THEMEING //////

    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-menu-background-color",
        "--second-menu-background-color",
        "--food-card-color",
        "--add-button-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
    }
    /////THEMEING //////

    window.addEventListener("scroll", handleScroll);
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
      payload: { searchClicked: false },
    });
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Menu" });
  }, []);

  const setMenu = (name, type) => {
    setState((state) => ({ ...state, activeMenu: name }));
    dispatch({ type: TYPES.CURRENT_MENU, payload: name });
  };
  const handleClose = () => setState({ showData: false });
  // const handleShow = () => setState({ showData: true });
  React.useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // const closeMenu = () => {
  //   dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
  //   dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
  // };

  return (
    <>
      {localStorage.getItem("table_id") === null && state.showData === true ? (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={state.showData}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Please scan a new table to continue</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <>
          <div
            onClick={() => {
              dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
              dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
            }}
            className="menu-screen"
          >
            <nav
              className={classnames("food-bar-menu", {
                "food-bar--hidden": !visible,
              })}
            >
              {bar_menu.length > 0 ? (
                <ul className="menu-btn">
                  <li
                    className={
                      currentMenu === "food"
                        ? "menu-active bar-active"
                        : "menu-inactive bar-inactive"
                    }
                    onClick={() => setMenu("food", food_menu)}
                  >
                    <div className="menu-item-names">Food Menu</div>
                  </li>
                  <li
                    className={
                      currentMenu === "bar"
                        ? "menu-active food-active"
                        : "menu-inactive food-inactive"
                    }
                    onClick={() => setMenu("bar", bar_menu)}
                  >
                    <div className="menu-item-names">Bar Menu</div>
                  </li>
                </ul>
              ) : null}
            </nav>
            <div className="category">
              {currentMenu === "food"
                ? food_menu.map((item, idx) => (
                    <React.Fragment key={`Category-${idx}`}>
                      <p className="category-subs" style={{ zIndex: idx + 1 }}>
                        {item.name}
                      </p>
                      <>
                        {/* <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Category
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                          Another action
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Something else
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                      </>
                      <SubCategory
                        subs={item}
                        categories={idx}
                        key={`category-cards-${idx}`}
                        subOrderingAbility={orderingAbility}
                      />
                    </React.Fragment>
                  ))
                : bar_menu.map((item, idx) => (
                    <React.Fragment key={`Category-${idx}`}>
                      <p className="category-subs" style={{ zIndex: idx + 1 }}>
                        {item.name}
                      </p>
                      <>
                        {/* <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Category
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                          Another action
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Something else
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                      </>
                      <SubCategory
                        subs={item}
                        categories={idx}
                        key={`category-cards-${idx}`}
                        subOrderingAbility={orderingAbility}
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

const SubCategory = ({ subs, categories, subOrderingAbility }) => (
  <>
    <p
      id={`menu-${categories}`}
      style={{
        fontSize: "1.1rem",
        color: "#334252",
        fontWeight: 600,
        marginBottom: "0rem",
      }}
    ></p>
    {subs.food_list.map((foodItem, idx3) => (
      <div key={idx3}>
        {foodItem.visibility ? (
          <FoodItem
            foodItem={foodItem}
            subs={subs}
            subsIndex={categories}
            index={idx3}
            key={`food-item-${idx3}`}
            restOrderingAbility={subOrderingAbility}
          />
        ) : null}
      </div>
    ))}
  </>
);

const menuWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Menu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default menuWithSocket;
