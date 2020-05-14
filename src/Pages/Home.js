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
import sampleImage from "../assets/300.png";
import sample from '../assets/sample.png'
import PlusWithAddRemove from "components/PlusWithAddRemove";
import dummyPic from "assets/dummypic.jpeg";
import HomeItem from "components/HomeItem";
import { Toast } from "react-bootstrap";
import vodkaPic from "assets/vodka.jpg";
import SearchFoodItems from "components/SearchFoodItems.js";
import SocketContext from "../socket-context";
import Slider from "react-slick";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

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
          slidesToShow: 1.5,
          slidesToScroll: 1
        }
      }
    ]
  };

  const [state, setState] = React.useState({
    active: false,
    subMenu: [] //0: Personal cart, 1: Table cart
  });

  React.useEffect(() => {
    console.log("home screen");
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

    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: "BNGHSR0001"
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("user_details").on("user_details", msg => {
      console.log("USER DETAILS--->", msg);
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
      dispatch({ type: TYPES.REFRESH_ORDER_CLOUD, payload: data.table_orders });

      dispatch({
        type: TYPES.UPDATE_TABLE_ORDER,
        payload: data.table_cart || []
      });
    });

    props.socket.off("restaurant_object").on("restaurant_object", msg => {
      const resp = JSON.parse(msg);

      dispatch({ type: TYPES.SET_RESTAURANT_NAME, payload: resp.name });
      dispatch({ type: TYPES.ADD_DATA, payload: resp });
      dispatch({ type: TYPES.ADD_SELECT_DATA, payload: resp.food_menu });

      let justBarItems = [];
      let justFoodItems = [];
      const barMenu = resp.bar_menu;
      for (let i = 0; i < barMenu.length; ++i) {
        const Sub = resp.food_menu[i].name;
        for (let j = 0; j < resp.bar_menu[i].food_list.length; ++j) {
          justFoodItems.push(resp.bar_menu[i].food_list[j]);
          // const FoodList = Sub[j].foodlist;
          // for (let k = 0; k < FoodList.length; ++k) {
          //   justFoodItems.push(FoodList[k]);
          // }
        }
      }

      const Menu = resp.food_menu;
      for (let i = 0; i < Menu.length; ++i) {
        const Sub = resp.food_menu[i].name;
        for (let j = 0; j < resp.food_menu[i].food_list.length; ++j) {
          justFoodItems.push(resp.food_menu[i].food_list[j]);
          // const FoodList = Sub[j].foodlist;
          // for (let k = 0; k < FoodList.length; ++k) {
          //   justFoodItems.push(FoodList[k]);
          // }
        }
      }
      dispatch({
        type: TYPES.ADD_COLLECTIVE_FOODITEMS,
        payload: justFoodItems
      });
    });

    props.socket.off("home_screen_lists").on("home_screen_lists", msg => {
      dispatch({ type: TYPES.UPDATE_HOME_ITEMS, payload: JSON.parse(msg) });
    });
  }, []);

  const [show, setShow] = React.useState(false);
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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div className="category home-category">
          <Card>
            <Card.Title className="rest-card-home">
              {" "}
              Welcome to {restName}
            </Card.Title>
            <Card.Body>HSR Layout,Bangalore</Card.Body>
          </Card>
          {Object.entries(homeItems).map((data, idx) => {
            if (idx === 1) {
              return (
                <div>
                  <span className="home-title">{data[0]}</span>
                  <div>
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
                      
                        className="nidhi"
                        key={`category-cards-${index}`}
                      >
                      
                        <div class="bg-image"
                          style = {{backgroundImage: `url(${sample})`, height:'100%'}}
                        >
                        
                        </div>
                        <p class="main-items">{item[0]}</p>
                    
                      </Card>
                    );
                  })}
                </div>
                </div>
              );
            }
          })}
          {Object.entries(homeItems).map((data, idx) => {
            if (idx !== 0 && idx !== 1) {
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
                          if (list._id.$oid === item) {
                            return (
                              <Card
                                className="category card home-item"
                                key={`category-cards-${ix}`}
                              >
                                <div>
                                  <div>
                                    <img
                                      onClick={() =>
                                        props.history.push("/menu", {
                                          data: list.name
                                        })
                                      }
                                      style={{ float: "left" }}
                                      className="card-image card-home-image"
                                      src={sampleImage}
                                      alt="sample"
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginLeft: "35%"
                                    }}
                                  >
                                    <p className="item-name item-home">
                                      {list.name}
                                    </p>
                                    <div className="options-modal options-home">
                                      {desc}
                                    </div>
                                    <div>
                                      <p className="item-price">
                                        ₹ {list.price}
                                      </p>
                                      <PlusWithAddRemove
                                        item={list}
                                        idx={ix}
                                        subs={idx}
                                      />
                                    </div>
                                  </div>
                                </div>
                                {list.foodOptions &&
                                list.foodOptions === true ? (
                                  <Modal
                                    show={list.showPopup}
                                    onHide={handleClose}
                                  >
                                    <Modal.Header>
                                      <Modal.Title className="options-title">
                                        {list.name} <br />{" "}
                                        <div className="options-modal">
                                          {list.description}
                                        </div>
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {cart.length
                                        ? cart.map(item => {
                                            if (
                                              list._id.$oid === item._id.$oid
                                            ) {
                                              return (
                                                <div>
                                                  <div>
                                                    <p
                                                      style={{
                                                        width: "69%",
                                                        fontSize: ".9rem",
                                                        float: "left"
                                                      }}
                                                    >
                                                      Rs{" "}
                                                      {
                                                        item.options
                                                          .option_price
                                                      }{" "}
                                                      <br />
                                                      Option:
                                                      {
                                                        item.options.option_name
                                                      }{" "}
                                                      <br />
                                                    </p>
                                                    <PlusWithAddRemove
                                                      item={list}
                                                      idx={ix}
                                                      subs={idx}
                                                    />
                                                    <br />
                                                  </div>
                                                </div>
                                              );
                                            }
                                          })
                                        : ""}
                                      {list.options
                                        ? ""
                                        : Object.entries(list.food_options).map(
                                            (item, index) => {
                                              return Object.values(item[1]).map(
                                                (item1, idx) => {
                                                  return (
                                                    <div key={idx}>
                                                      <Form.Check
                                                        onClick={() =>
                                                          selectOption(
                                                            list,
                                                            item1
                                                          )
                                                        }
                                                        type="radio"
                                                        label={
                                                          item1.option_name
                                                        }
                                                        name="test"
                                                      />
                                                    </div>
                                                  );
                                                }
                                              );
                                            }
                                          )}
                                      {list.showCustomize ? (
                                        <div
                                          className="modal-customization"
                                          onClick={() =>
                                            showOptions(list, ix, idx)
                                          }
                                        >
                                          Add More Customization
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {list.showOptionsAgain
                                        ? Object.entries(list.food_options).map(
                                            (item, index) => {
                                              return Object.values(item[1]).map(
                                                (item1, idx) => {
                                                  return (
                                                    <div key={idx}>
                                                      <Form.Check
                                                        onClick={() =>
                                                          selectOption(
                                                            list,
                                                            item1
                                                          )
                                                        }
                                                        type="radio"
                                                        label={
                                                          item1.option_name
                                                        }
                                                        name="test"
                                                      />
                                                    </div>
                                                  );
                                                }
                                              );
                                            }
                                          )
                                        : ""}
                                    </Modal.Body>

                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        onClick={() =>
                                          closePopUp(list, ix, idx)
                                        }
                                      >
                                        Close
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={() => addItem(list, ix, idx)}
                                      >
                                        Add
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                ) : (
                                  ""
                                )}
                              </Card>
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
