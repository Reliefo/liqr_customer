/* eslint-disable */
import React from "react";
import { Card, Modal, Button } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import SearchFoodItems from "components/SearchFoodItems.js";
import SocketContext from "../socket-context";
import Slider from "react-slick";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import FoodItem from "components/FoodItem";
import Loader from "./Loader";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = (props) => {
  const {
    dispatch,
    state: {
      homeItems,
      rawData: { food_menu = [], bar_menu=[] },
      cartData,
      restName,
      restAddress,
      restImages,
      restLogo,
      searchClicked,
      orderingAbility,
      barFoodMenuCats,
      currentMenu,
    },
  } = React.useContext(StoreContext);

  function getSettings(idx) {
    var speed = 3000 + (idx % 2) * 1000;
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      centerMode: true,
      centerPadding: "20px",
      autoplay: true,
      autoplaySpeed: speed,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,

          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            // dotsClass: "slickDots",
            // customPaging: function (slider, i) {
            //   return <a>{slider + 1} </a>;
            // },
            dots: true,
            infinite: true,
          },
        },
      ],
    };
    return settings;
  }
  let settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    rows: 1,
    slidesPerRow: 2,
    centerPadding: "50px",
    centerMode: false,
    touchThreshold: 8,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  const [index, setIndex1] = React.useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex1(selectedIndex);
  };

  const [state, setState] = React.useState({
    height: "",
    active: false,
    subMenu: [], //0: Personal cart, 1: Table cart
    showData: true,
    imageLinks: {},
    isloading: true,
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
    props.socket.off("order_updates").on("order_updates", (msg) => {
      dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
    });
    console.log(props.socket);

    // if (
    //   ((props.location.state && props.location.state.login === false) ||
    //     undefined ||
    //     null) &&
    //   props.socket.connected === false
    // ) {
    //   let bodyFormData = new FormData();
    //   bodyFormData.set("table_id", localStorage.getItem('table_id'));
    //   axios({
    //     method: "post",
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
    //     },
    //     url: "https://liqr.cc/refresh",
    //     data: bodyFormData
    //   }).then(response => {
    //     const { data } = response;

    //     setTimeout(function() {
    //       if (props.socket.connected === false) {
    //         localStorage.setItem("jwt", data.access_token);
    //         localStorage.setItem("restaurant_id", data.restaurant_id);
    //         //Start the timer
    //         ReactDOM.render(<AppWrapper />, document.getElementById("root"));
    //       }
    //     }, 1000);
    //   });
    // }

    if (props.location.state && props.location.state.login === true) {
      dispatch({ type: TYPES.RESET_CART });
    }
    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id"),
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("user_details").on("user_details", (msg) => {
      const data = JSON.parse(msg);
      dispatch({
        type: TYPES.SET_DINE_HISTORY,
        payload: data.dine_in_history || [],
      });
      if (data._cls === "User.TempUser"){

        dispatch({ type: TYPES.SET_REGISTERED, payload: false });
      }
      else{

        dispatch({ type: TYPES.SET_REGISTERED, payload: true });
      }
    });

    props.socket.off("table_details").on("table_details", (msg) => {
      const data = JSON.parse(msg);
      dispatch({
        type: TYPES.UPDATE_TABLE_USERS,
        payload: data.users,
      });
      dispatch({
        type: TYPES.UPDATE_TABLE_NAME,
        payload: data.name,
      });
      dispatch({
        type: TYPES.REFRESH_ORDER_CLOUD,
        payload: data.table_orders,
      });

      dispatch({
        type: TYPES.UPDATE_TABLE_CART,
        payload: data.table_cart || [],
      });
    });
    props.socket.off("restaurant_object").on("restaurant_object", (msg) => {
      const resp = JSON.parse(msg);
      dispatch({ type: TYPES.ADD_REST_IMAGES, payload: resp.home_page_images });
      dispatch({ type: TYPES.ADDONS, payload: resp.add_ons });
      dispatch({ type: TYPES.SET_RESTAURANT_NAME, payload: resp.name });
      dispatch({ type: TYPES.ADD_REST_ADDRESS, payload: resp.abs_address });
      dispatch({ type: TYPES.ADD_REST_TAXES, payload: resp.taxes});
      dispatch({ type: TYPES.ADD_REST_LOGO, payload: resp.logo });
      dispatch({ type: TYPES.OPERATING_CURRENCY, payload: resp.currency });
      dispatch({
        type: TYPES.ORDERING_ABILITY,
        payload: resp.ordering_ability,
      });
      dispatch({
        type: TYPES.DISPLAY_ORDER_BUTTONS,
        payload: resp.display_order_buttons,
      });
      dispatch({ type: TYPES.ADD_DATA, payload: resp });
      dispatch({ type: TYPES.UPDATE_REST_ID, payload: resp.restaurant_id });
      // dispatch({ type: TYPES.UPDATE_REST_ID, payload: resp._id.$oid });
      // dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: resp.food_menu });
      var catList = { food: [], bar: [] };
      resp.food_menu?.forEach((category, catIndex) => {
        catList["food"].push(category.name);
      });
      resp.bar_menu?.forEach((category, catIndex) => {
        catList["bar"].push(category.name);
      });
      // console.log(catList);
      dispatch({ type: TYPES.BAR_FOOD_MENU_CATS, payload: catList });
      // console.log(currentMenu);
      if (currentMenu === undefined) {
        dispatch({ type: TYPES.CURRENT_MENU, payload: "food" });
      }
      dispatch({
        type: TYPES.THEME_PROPERTIES,
        payload: resp.theme_properties,
      });

      /////THEMEING //////
      // if CAFE_MEDLEY:
      if (resp.theme_properties["theme"] === true) {
        let cssVariables = [
          "--theme-font",
          "--first-background-color",
          "--second-background-color",
          "--first-menu-background-color",
          "--second-menu-background-color",
          "--first-light-color",
          "--second-light-color",
          "--first-pattern-light-color",
          "--second-pattern-light-color",
          "--food-card-color",
          "--welcome-card-color",
          "--welcome-card-text-color",
          "--food-menu-button-color",
          "--add-button-color",
          "--top-bar-color",
          "--search-background-color",
          "--burger-menu-background-color",
          "--first-footer-color",
          "--second-footer-color",
          "--categories-button-color",
          "--categories-list-item-color",
        ];
        cssVariables.forEach((item, key) => {
          // console.log(item,key);
          document.documentElement.style.setProperty(
            item,
            resp.theme_properties["variables"][item]
          );
        });
     } else {
       document.documentElement.style.setProperty(
          "--top-bar-color",
          "#ffb023"
        );
        document.documentElement.style.setProperty(
          "--search-background-color",
          "#ffc45c"
        );
        document.documentElement.style.setProperty(
          "--burger-menu-background-color",
          "#c0841d"
        );
        //Footer//
        document.documentElement.style.setProperty(
          "--first-footer-color",
          "#ffb023"
        );
        document.documentElement.style.setProperty(
          "--second-footer-color",
          "#ffb023"
        );
        document.documentElement.style.setProperty(
          "--categories-button-color",
          "#ffffff"
        );
        document.documentElement.style.setProperty(
          "--categories-list-item-color",
          "#ffffff"
        );
        document.documentElement.style.setProperty(
          "--categories-list-border-color",
          "#4f3e2c"
        );
      }
      /////THEMEING //////
    });

    props.socket.off("home_screen_lists").on("home_screen_lists", (msg) => {
      dispatch({ type: TYPES.UPDATE_HOME_ITEMS, payload: JSON.parse(msg) });
      setState({ isloading: false });
    });
    return () => { isMounted = false };
  }, [props.socket, dispatch, props.location]);

  const handleClose = () => setState({ showData: false });
  // const handleShow = () => setState({ showData: true });

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
      ) : state.isloading === true ? (
        <Loader />
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          className="home-screen"
        >
          <div className="home-screen-images">
            <Carousel
              activeIndex={index}
              indicators={false}
              onSelect={handleSelect}
            >
              {Object.entries(restImages).map((data, idx) => {
                return (
                  <Carousel.Item key={idx}>
                    <img
                      className="d-block w-100"
                      src={data[1]}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      {/* <h3>First slide label</h3> */}
                      {/* <p> */}
                      {/* Nulla vitae elit libero, a pharetra augue mollis interdum. */}
                      {/* </p> */}
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
            <Card className="welcome-card-carousel">
              {restLogo == undefined ? (
                <Card.Title className="welcome-card-home welcome-card-title">
                  {" "}
                  Welcome to {restName}
                </Card.Title>
              ) : (
                <Card.Img variant="top" src={restLogo} />
              )}
              <Card.Body className="welcome-card-text">{restAddress}</Card.Body>
              <Link to="/menu" className="styled-link-home">
                <Card className="full-menu-button-div">
                  <div>
                    <Card.Title className="full-menu-text">
                      Full Menu
                    </Card.Title>
                  </div>
                </Card>
              </Link>
            </Card>
          </div>
          <div className="rest-of-home-screen">
            {Object.entries(homeItems).map((data, idx) => {
              if (idx === 0) {
                return (
                  <div key={idx}>
                    <span className="home-screen-headings">{data[0]}</span>
                    <Slider {...settings2}>
                      {Object.entries(data[1]).map((item, index) => {
                        return (
                          // <div className="card-needs-help">
                          <Card
                            onClick={() =>
                              props.history.push("/submenu", {
                                data: item[1]["food_list"],
                                sbx: index,
                                foodMenu: cartData,
                                subMenuName: item[0],
                              })
                            }
                            className="need-help-div"
                            key={`category-cards-${index}`}
                          >
                            <Card.Img
                              className="need-help-images"
                              src={item[1]["image"]}
                            />
                            <Card.Footer className="need-help-names">
                              {item[0]}
                            </Card.Footer>
                          </Card>
                          // </div>
                        );
                      })}
                    </Slider>
                  </div>
                );
              }
            })}
            {Object.entries(homeItems).map((data, idx) => {
              if (idx !== 0) {
                return (
                  <Card
                    className="home-screen-lists-card"
                    key={`category-cards-${idx}`}
                  >
                    <Card.Title className="home-screen-headings">
                      <span className="home-screen-headings-text">
                        {data[0]}
                      </span>
                      <Button
                        className="view-all-home-screen"
                        variant="primary"
                        onClick={() =>
                          props.history.push("/submenu", {
                            data: data[1]["food_list"],
                            sbx: idx,
                            foodMenu: cartData,
                            subMenuName: data[0],
                          })
                        }
                      >
                        View All
                      </Button>
                    </Card.Title>
                    <Slider {...getSettings(idx)} className="custom-slider">
                      {Object.values(data[1]["food_list"]).map(
                        (foodId, foodIdIndex) => {
                          return Object.values(food_menu.concat(bar_menu)).map((subCategory, categoryIdx) => {
                            return Object.values(subCategory.food_list).map(
                              (foodItem, foodItemIndex) => {
                                if (foodItem._id.$oid === foodId) {
                                  return (
                                    <div id="card-home-screen">
                                      <FoodItem
                                        foodItem={foodItem}
                                        subs={subCategory}
                                        subsIndex={categoryIdx}
                                        index={foodItemIndex}
                                        key={`food-item-${foodItemIndex}`}
                                        restOrderingAbility={orderingAbility}
                                        fromhome="home"
                                        menuType="food"
                                      />
                                    </div>
                                  );
                                }
                              }
                            );
                          });
                        }
                      )}
                    </Slider>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      )}
    </>
  );
};

const homeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default homeWithSocket;
