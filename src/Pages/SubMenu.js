import React from "react";
import { Card, CardDeck, Image } from "react-bootstrap";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import FoodItem from "../components/FoodItem";
import dummyPic from "assets/dummypic.jpeg";
import HomeItem from "components/HomeItem";
import vodkaPic from "assets/vodka.jpg";
import SocketContext from "../socket-context";
import Slider from "react-slick";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

const SubMenu = (props) => {
  const {
    dispatch,
    state: {
      homeItems,
      activeData,
      orderingAbility,
      rawData: { food_menu = [] },
    },
  } = React.useContext(StoreContext);

  React.useEffect(() => {
    console.log("home screen");
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
  }, []);

  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="category default-screen">
      <p className="category-subs" style={{zIndex:4}}>
                      {props.location.state.subMenuName}
                    </p>
        {Object.values(props.location.state.data).map((item, index) => {
          return Object.values(props.location.state.foodMenu).map(
            (food, idx) => {
              return Object.values(food.food_list).map((list, ix) => {
                let desc = list.description
                  ? list.description.substring(0, 40) + "..."
                  : "";
                if (list._id.$oid === item) {
                  return (
                    <FoodItem
                      from="home"
                      stateData={props.location.state.foodMenu}
                      foodItem={list}
                      subs={food}
                      subsIndex={idx}
                      index={ix}
                      key={`food-item-${index}`}
                      restOrderingAbility={orderingAbility}
                    />
                  );
                }
              });
            }
          );
        })}
      </div>
    </>
  );
};

const SubMenuWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SubMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SubMenuWithSocket;
