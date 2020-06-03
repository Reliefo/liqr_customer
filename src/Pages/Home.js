import React from "react";
import {
  Card,
  CardDeck,
  Image,
  Accordion,
  Modal,
  Button,
  Form
} from "react-bootstrap";
import ReactDOM from "react-dom";
import axios from "axios";
import sampleImage from "../assets/300.png";
import sample from "../assets/sample.png";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import Search from "./Search";
import dummyPic from "assets/dummypic.jpeg";
import HomeItem from "components/HomeItem";
import { Carousel } from "react-bootstrap";
import vodkaPic from "assets/vodka.jpg";
import SearchFoodItems from "components/SearchFoodItems.js";
import SocketContext from "../socket-context";
import Slider from "react-slick";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import AppWrapper from "../App";
import FoodItem from "components/FoodItem";

const Home = props => {
  const {
    dispatch,
    state: {
      homeItems,
      rawData: { food_menu = [] },
      activeData,
      restName,
      cart,
      searchClicked
    }
  } = React.useContext(StoreContext);

  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          infinite: true
        }
      }
    ]
  };

  let settings2 = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: 1,
    slidesPerRow: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  };

  const [index, setIndex1] = React.useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex1(selectedIndex);
  };

  const [state, setState] = React.useState({
    height: "",
    active: false,
    subMenu: [], //0: Personal cart, 1: Table cart
    showData: true
  });

  React.useEffect(() => {
    console.log("home screen");
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
    props.socket.off("order_updates").on("order_updates", msg => {
      dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
    });
    console.log(props.socket);

    if (
      ((props.location.state && props.location.state.login === false) ||
        undefined ||
        null) &&
      props.socket.connected === false
    ) {
      axios({
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
        },
        url: "https://liqr.cc/refresh"
      }).then(response => {
        const { data } = response;

        setTimeout(function() {
          if (props.socket.connected === false) {
            localStorage.setItem("jwt", data.access_token);
            //Start the timer
            ReactDOM.render(<AppWrapper />, document.getElementById("root"));
          }
        }, 1000);
      });
    }
    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id")
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("user_details").on("user_details", msg => {
      console.log("USER DETAILS--->", JSON.parse(msg));
      const data = JSON.parse(msg);
      dispatch({
        type: TYPES.SET_DINE_HISTORY,
        payload: data.dine_in_history || []
      });
    });

    props.socket.off("table_details").on("table_details", msg => {
      const data = JSON.parse(msg);
      dispatch({
        type: TYPES.UPDATE_TABLE_USERS,
        payload: data.users
      });
      dispatch({
        type: TYPES.UPDATE_TABLE_NAME,
        payload: data.name
      });
      dispatch({
        type: TYPES.REFRESH_ORDER_CLOUD,
        payload: data.table_orders
      });

      dispatch({
        type: TYPES.UPDATE_TABLE_ORDER,
        payload: data.table_cart || []
      });
    });

    props.socket.off("restaurant_object").on("restaurant_object", msg => {
      const resp = JSON.parse(msg);

      dispatch({ type: TYPES.SET_RESTAURANT_NAME, payload: resp.name });
      dispatch({ type: TYPES.ADD_DATA, payload: resp });
      dispatch({ type: TYPES.UPDATE_REST_ID, payload: resp._id.$oid });
      dispatch({ type: TYPES.ADD_SELECT_DATA, payload: resp.food_menu });

      let justBarItems = [];
      let justFoodItems = [];

      justFoodItems.push(resp.bar_menu);
      justFoodItems.push(resp.food_menu);
      dispatch({
        type: TYPES.ADD_COLLECTIVE_FOODITEMS,
        payload: justFoodItems
      });
    });

    props.socket.off("home_screen_lists").on("home_screen_lists", msg => {
      dispatch({ type: TYPES.UPDATE_HOME_ITEMS, payload: JSON.parse(msg) });
    });
  }, [props.socket, dispatch, props.location]);

  const selectOption = (foodItem, item) => {
    foodItem.food_option = item;
  };
  const addItem = (item, index, subsIndex) => {
    if (item["options"] === undefined) {
      item["options"] = {};
    }
    item["options"] = item.food_option;
    dispatch({ type: TYPES.ADD_ITEM, payload: item }); //dispatcing the whole item

    activeData.forEach((item2, index3) => {
      if (index3 === subsIndex) {
        item2.food_list.forEach((item3, idx2) => {
          if (idx2 === index) {
            item3.showPopup = false;
            item3.showCustomize = false;
            item3.showOptionsAgain = false;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const setIndex = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.open = !item1.open;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const closePopUp = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.showPopup = !item1.showPopup;
            item1.showCustomize = false;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const showOptions = (foodItem, index, subsIndex) => {
    activeData.forEach((item, index3) => {
      if (index3 === subsIndex) {
        item.food_list.forEach((item1, idx2) => {
          if (idx2 === index) {
            item1.showOptionsAgain = true;
          }
        });
      }
    });
    dispatch({ type: TYPES.ADD_SELECT_DATA, payload: activeData });
  };

  const handleClose = () => setState({ showData: false });
  const handleShow = () => setState({ showData: true });

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
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          className="category home-category"
        >
          <div style={{ minHeight: "400px" }}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://picsum.photos/800/400?text=First slide&bg=373940"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://picsum.photos/800/400?text=Second slide&bg=282c34"
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://picsum.photos/800/400?text=Third slide&bg=20232a"
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
            <Card className="home-title-card-carousel">
              <Card.Title className="rest-card-home">
                {" "}
                Welcome to {restName}
              </Card.Title>
              <Card.Body>HSR Layout,Bangalore</Card.Body>
            </Card>
          </div>
          <Search />
          {Object.entries(homeItems).map((data, idx) => {
            if (idx === 0) {
              return (
                <div style={{ marginTop: "15%" }}>
                  <span className="home-title">{data[0]}</span>
                  <Slider {...settings2}>
                    {Object.entries(data[1]).map((item, index) => {
                      return (
                        <Card
                          onClick={() =>
                            props.history.push("/submenu", {
                              data: item[1],
                              sbx: index,
                              foodMenu: activeData
                            })
                          }
                          className="available-items"
                          key={`category-cards-${index}`}
                        >
                          <div
                            className="bg-image"
                            style={{
                              backgroundImage: `url(${sample})`,
                              height: "100%"
                            }}
                          ></div>
                          <p className="main-items">{item[0]}</p>
                        </Card>
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
                  className="category-card main-home-card"
                  key={`category-cards-${idx}`}
                >
                  <Card.Title className="home-title">{data[0]}</Card.Title>
                  <Slider {...settings}>
                    {Object.values(data[1]).map((item, index) => {
                      if (typeof item === "object") {
                      }
                      return Object.values(activeData).map((food, idx) => {
                        return Object.values(food.food_list).map((list, ix) => {
                          let desc = list.description.substring(0, 40) + "...";
                          list.description = desc;
                          if (list._id.$oid === item) {
                            return (
                              <div id="card-home-screen">
                                <FoodItem
                                  from="home"
                                  stateData={activeData}
                                  foodItem={list}
                                  subs={food}
                                  subsIndex={idx}
                                  index={ix}
                                  key={`food-item-${ix}`}
                                />
                              </div>
                              // <Card
                              //   className="category card home-item"
                              //   key={`category-cards-${ix}`}
                              // >
                              //   <div>
                              //     <div>
                              //       <img
                              //         onClick={() =>
                              //           props.history.push("/menu", {
                              //             data: list.name
                              //           })
                              //         }
                              //         style={{ float: "left" }}
                              //         className="card-image card-home-image"
                              //         src={sampleImage}
                              //         alt="sample"
                              //       />
                              //     </div>
                              //     <div
                              //       style={{
                              //         marginLeft: "35%"
                              //       }}
                              //     >
                              //       <p className="item-name item-home">
                              //         {list.name}
                              //       </p>
                              //       <div className="options-modal options-home">
                              //         {desc}
                              //       </div>
                              //       <div>
                              //         <p className="item-price">
                              //           ₹ {list.price}
                              //         </p>
                              //         <PlusWithAddRemove
                              //           item={list}
                              //           idx={ix}
                              //           subs={idx}
                              //         />
                              //       </div>
                              //     </div>
                              //   </div>
                              //   {list.foodOptions &&
                              //   list.foodOptions === true ? (
                              //     <Modal
                              //       size="lg"
                              //       aria-labelledby="contained-modal-title-vcenter"
                              //       centered
                              //       show={list.showPopup}
                              //       onHide={handleClose}
                              //     >
                              //       <Modal.Header>
                              //         <Modal.Title className="options-title">
                              //           {list.name} <br />{" "}
                              //           <div className="options-modal">
                              //             {list.description}
                              //           </div>
                              //         </Modal.Title>
                              //       </Modal.Header>
                              //       <Modal.Body>
                              //         {cart.length
                              //           ? cart.map(item => {
                              //               if (
                              //                 list._id.$oid === item._id.$oid
                              //               ) {
                              //                 return (
                              //                   <div>
                              //                     <div>
                              //                       <p
                              //                         style={{
                              //                           width: "69%",
                              //                           fontSize: ".9rem",
                              //                           float: "left"
                              //                         }}
                              //                       >
                              //                         Rs{" "}
                              //                         {
                              //                           item.options
                              //                             .option_price
                              //                         }{" "}
                              //                         <br />
                              //                         Option:
                              //                         {
                              //                           item.options.option_name
                              //                         }{" "}
                              //                         <br />
                              //                       </p>
                              //                       <PlusWithAddRemove
                              //                         item={list}
                              //                         idx={ix}
                              //                         subs={idx}
                              //                       />
                              //                       <br />
                              //                     </div>
                              //                   </div>
                              //                 );
                              //               }
                              //             })
                              //           : ""}
                              //         {list.options
                              //           ? ""
                              //           : Object.entries(list.food_options).map(
                              //               (item, index) => {
                              //                 return Object.values(item[1]).map(
                              //                   (item1, idx) => {
                              //                     return (
                              //                       <div key={idx}>
                              //                         <Form.Check
                              //                           onClick={() =>
                              //                             selectOption(
                              //                               list,
                              //                               item1
                              //                             )
                              //                           }
                              //                           type="radio"
                              //                           label={
                              //                             item1.option_name
                              //                           }
                              //                           name="test"
                              //                         />
                              //                       </div>
                              //                     );
                              //                   }
                              //                 );
                              //               }
                              //             )}
                              //         {list.showCustomize ? (
                              //           <div
                              //             className="modal-customization"
                              //             onClick={() =>
                              //               showOptions(list, ix, idx)
                              //             }
                              //           >
                              //             Add More Customization
                              //           </div>
                              //         ) : (
                              //           ""
                              //         )}
                              //         {list.showOptionsAgain
                              //           ? Object.entries(list.food_options).map(
                              //               (item, index) => {
                              //                 return Object.values(item[1]).map(
                              //                   (item1, idx) => {
                              //                     return (
                              //                       <div key={idx}>
                              //                         <Form.Check
                              //                           onClick={() =>
                              //                             selectOption(
                              //                               list,
                              //                               item1
                              //                             )
                              //                           }
                              //                           type="radio"
                              //                           label={
                              //                             item1.option_name
                              //                           }
                              //                           name="test"
                              //                         />
                              //                       </div>
                              //                     );
                              //                   }
                              //                 );
                              //               }
                              //             )
                              //           : ""}
                              //       </Modal.Body>

                              //       <Modal.Footer>
                              //         <Button
                              //           variant="secondary"
                              //           onClick={() =>
                              //             closePopUp(list, ix, idx)
                              //           }
                              //           className="options-button-close"
                              //         >
                              //           Close
                              //         </Button>
                              //         <Button
                              //            className="options-button-add"
                              //           variant="primary"
                              //           onClick={() => addItem(list, ix, idx)}
                              //         >
                              //           Add
                              //         </Button>
                              //       </Modal.Footer>
                              //     </Modal>
                              //   ) : (
                              //     ""
                              //   )}
                              // </Card>
                            );
                          }
                        });
                      });
                    })}
                  </Slider>
                </Card>
              );
            }
          })}
        </div>
      )}
    </>
  );
};

const homeWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default homeWithSocket;
