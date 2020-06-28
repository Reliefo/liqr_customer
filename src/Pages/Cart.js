/* eslint-disable no-unused-expressions */
import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Form, Modal, Button } from "react-bootstrap";
import AddRemoveItem from "components/AddRemoveItem.js";
import { StoreContext } from "Store";
import ReactDOM from "react-dom";
import AppWrapper from "../App";
import axios from "axios";
import SocketContext from "../socket-context";
import * as TYPES from "Store/actionTypes.js";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodTraySVG } from "assets/food-tray.svg";
import { ReactComponent as TableSVG } from "assets/table.svg";
import { ReactComponent as EmptyCartSadIMG } from "assets/empty-card-sad.svg";
import CloseSVG from "components/CloseSVG.js";
import _ from "lodash";
import { Table as RBTable, Collapse } from "react-bootstrap";
import Bill from "components/Bill.js";
import CollapseDetails from "./Collapse.js";
import { ReactComponent as TableFilledIMG } from "assets/Table-Filled.svg";
import { ReactComponent as PersonalSVG } from "assets/personal.svg";

const Cart = (props) => {
  const {
    dispatch,
    state: { cart, tableId, tableOrders, placeOrderById, searchClicked },
  } = React.useContext(StoreContext);
  //$rest-font 
  const rest_font = 'Inconsolata';

  let orderId = [];

  if (tableOrders && Object.keys(tableOrders).length > 0) {
    Object.values(tableOrders.orders).forEach((item) => {
      if (item.food_list.length > 0 && !orderId.includes(item.placed_by.name)) {
        orderId.push(item.placed_by.name);
      }
    });
  }

  const [state, setState] = React.useState({
    activeCart: 0, //0: Personal cart, 1: Table cart
    showData: true,
  });

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
    console.log("Cart screen");
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Cart" });
  }, []);

  props.socket.off("new_orders").on("new_orders", (msg) => {
    const data = JSON.parse(msg);
    console.log(data);
    if (data.personal_order === undefined) {
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
      dispatch({
        type: TYPES.UPDATE_TABLE_ORDER,
        payload: [],
      });
      props.history.push("/table");
    } else {
      dispatch({ type: TYPES.RESET_CART });
      props.history.push("/table");
    }
  });

  props.socket.off("table_cart_orders").on("table_cart_orders", (msg) => {
    if (msg !== undefined) {
      dispatch({ type: TYPES.UPDATE_TABLE_ORDER, payload: JSON.parse(msg) });
      orderId = [];
    }
  });

  const DeleteItemHndlr = (item) => {
    dispatch({ type: TYPES.DEL_ITEM, payload: item });
  };

  const DeleteItemHndlrTableCart = (item, orderList) => {
    // dispatch({ type: TYPES.DEL_TABLE_ITEM, payload: item });

    const body = {
      table_id: localStorage.getItem("table_id"),
      order_id: orderList._id.$oid,
      food_id: item.food_id,
    };

    props.socket.emit("remove_table_cart", JSON.stringify(body));
  };

  const pushToCart = () => {
    setState((state) => ({ ...state, activeCart: 1 - state.activeCart }));
  };

  const setOrderTable = () => {
    const body = { table_id: localStorage.getItem("table_id") };
    props.socket.emit("place_table_order", JSON.stringify(body));
    dispatch({ type: TYPES.UPDATE_TABLE_ORDER, payload: [] });
    props.socket.off("new_orders").on("new_orders", (msg) => {
      console.log(msg);
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
      if (JSON.parse(msg).personal_order === undefined) {
      } else {
        dispatch({ type: TYPES.RESET_CART });
      }
      props.history.push("/table");
      const bodyData = {
        user_id: localStorage.getItem("user_id"),
        restaurant_id: localStorage.getItem("restaurant_id"),
      };

      props.socket.emit("fetch_rest_customer", JSON.stringify(bodyData));

      props.socket.off("restaurant_object").on("restaurant_object", (data) => {
        const resp = JSON.parse(data);
        dispatch({ type: TYPES.ADD_DATA, payload: resp });
        dispatch({ type: TYPES.ADD_SELECT_DATA, payload: resp.food_menu });
        setState((state) => ({ ...state, activeCart: 1 - state.activeCart }));
      });
    });
  };

  const setCartPlaceOrder = () => {
    const cartClone = _.cloneDeep(cart);

    cartClone.forEach((item) => {
      item.food_id = item._id.$oid;
      delete item.open;
      delete item.food_options;
      delete item.restaurant;
      delete item.showCustomize;
      delete item.showPopup;
      delete item.showOptionsAgain;
      delete item.foodOptions;
      if (item.options) {
        item.food_options = {};
        item.food_options.options = [];
        item.food_options.options.push(item.options);
        item.price = item.options.option_price;
      }
      if (item.choices) {
        if (item.food_options === undefined) {
          item.food_options = {};
        }
        item.food_options.choices = [];
        item.food_options.choices.push(item.choices);
      }
      delete item.choices;
      delete item.choice;
      delete item.options;
      delete item.food_option;
      delete item.tags;
      delete item._id;
    });

    const body = {
      table: localStorage.getItem("table_id"),
      orders: [
        { placed_by: localStorage.getItem("user_id"), food_list: cartClone },
      ],
    };
    console.log(body);

    props.socket.emit("place_personal_order", JSON.stringify(body));
    props.socket.off("new_orders").on("new_orders", (msg) => {
      const body = {
        user_id: localStorage.getItem("user_id"),
        restaurant_id: localStorage.getItem("restaurant_id"),
      };

      props.socket.emit("fetch_rest_customer", JSON.stringify(body));

      props.socket.off("restaurant_object").on("restaurant_object", (data) => {
        const resp = JSON.parse(data);
        dispatch({ type: TYPES.ADD_DATA, payload: resp });
        dispatch({ type: TYPES.ADD_SELECT_DATA, payload: resp.food_menu });
      });
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
      dispatch({ type: TYPES.RESET_CART });
      props.history.push("/table");
    });
  };

  const setCart = () => {
    const cartClone = _.cloneDeep(cart);
    cartClone.forEach((item) => {
      item.food_id = item._id.$oid;
      delete item.open;
      delete item.showPopup;
      delete item.food_options;
      delete item.showCustomize;
      delete item.restaurant;
      if (item.options) {
        item.food_options = {};
        item.food_options.options = [];
        item.food_options.options.push(item.options);
        item.price = item.options.option_price;
      }
      if (item.choices) {
        if (item.food_options === undefined) {
          item.food_options = {};
        }
        item.food_options.choices = [];
        item.food_options.choices.push(item.choices);
      }
      delete item.choices;
      delete item.choice;
      delete item.showOptionsAgain;
      delete item.options;
      delete item.foodOptions;
      delete item.food_option;
      delete item.tags;
      delete item._id;
    });

    const body = {
      table: localStorage.getItem("table_id"),
      orders: [
        { placed_by: localStorage.getItem("user_id"), food_list: cartClone },
      ],
    };

    const body1 = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id"),
    };

    props.socket.emit("push_to_table_cart", JSON.stringify(body));

    props.socket.emit("fetch_rest_customer", JSON.stringify(body1));

    props.socket.off("table_details").on("table_details", (msg) => {
      const data = JSON.parse(msg);
      dispatch({ type: TYPES.UPDATE_TABLE_ORDER, payload: data.table_cart });
    });

    dispatch({ type: TYPES.RESET_CART });
    setState((state) => ({ ...state, activeCart: 1 - state.activeCart }));
  };

  const renderPersonalCart = () => (
    <>
      {cart.map((item, idx) => (
        <Card className="cart-card cart-styling" key={`cart-card-${idx}`}>
          <Card.Body className="body">
            <p className="name">{item.name}</p>
            <AddRemoveItem
              className="trial"
              count={item.quantity}
              id={item}
              allData={item}
            />
            <p style={{ fontFamily: rest_font, margin: 0, width: "15%" }}>
              &#8377;{" "}
              {item.options
                ? parseInt(item.options.option_price * item.quantity)
                : item.price * item.quantity}
            </p>
            <div
              style={{ padding: ".5rem" }}
              onClick={DeleteItemHndlr.bind(this, item)}
            >
              <CloseSVG />
            </div>
          </Card.Body>
          {item.options !== undefined ? (
            <span className="detail-options">
              <strong>{item.options !== undefined ? "Options:" : ""}</strong>
            </span>
          ) : (
            ""
          )}
          {item.options !== undefined ? (
            <span className="detail-options">
              {item.options !== undefined ? item.options.option_name : ""}
            </span>
          ) : (
            ""
          )}
          {item.choices !== undefined ? (
            <span className="detail-options">
              <br />
              <strong>{item.choices !== undefined ? "Choices:" : ""}</strong>
            </span>
          ) : (
            ""
          )}
          {item.choices !== undefined ? (
            <span className="detail-options">
              {item.choices !== undefined ? item.choices : ""}
            </span>
          ) : (
            ""
          )}
          <span className="detail-instructions">
            {" "}
            <CollapseDetails item={item} />
          </span>

          <hr className="cart-hr" />
        </Card>
      ))}
    </>
  );
  const renderTableCart = () => (
    <>
      {orderId.map((id) => {
        return Object.entries(tableOrders).map((item2, idx) => {
          if (item2[0] === "orders") {
            return item2[1].map((order_list, index) => {
              if (order_list.placed_by.name === id) {
                return (
                  <React.Fragment key={`table-${index}`}>
                    {id}
                    <RBTable striped bordered hover>
                      <thead className="table-thead">
                        <tr>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      {order_list.food_list.map((food, ix) => {
                        return (
                          <tbody>
                            <tr>
                              <td>{food.name}</td>
                              <td>{food.quantity}</td>
                              <td>{food.price}</td>
                              <td
                                onClick={DeleteItemHndlrTableCart.bind(
                                  this,
                                  food,
                                  order_list
                                )}
                              >
                                <CloseSVG />
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </RBTable>
                  </React.Fragment>
                );
              }
            });
          }
        });
      })}
    </>
  );
  //TODO: useEffect for this
  const orderTotal =
    cart.length !== 0
      ? cart.reduce(
          (total, item) =>
            total +
            (item.options
              ? parseInt(item.options.option_price) * item.quantity
              : item.price * item.quantity),
          0
        )
      : "";

  let addOnTotal = 0;
  
  cart.forEach((item) => {
    if (item.addon) {
    item.addon.forEach((addon) => {
      if (typeof addon === "object") {
        addOnTotal += parseInt(addon.price);
      }
    });}
  });

  let sum = 0;
  tableOrders && Object.keys(tableOrders).length > 0
    ? Object.entries(tableOrders).forEach((item) => {
        if (item[0] === "orders") {
          item[1].forEach((item2) => {
            item2.food_list.forEach((item3) => {
              if (item.options) {
                sum += parseInt(item3.options.option_price) * item3.quantity;
              } else {
                sum += parseInt(item3.price * item3.quantity);
              }
            });
          });
        }
      })
    : "";

  const isEmpty = () => {
    if (state.activeCart === 0 && cart.length === 0) return true;
    if (state.activeCart === 1) return false; //TODO: figure this out
  };

  const handleClose = () => setState({ showData: false });
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
          className="default-screen"
        >
          <ul className="menu-btn">
            <li
              className={
                state.activeCart === 0
                  ? "menu-active bar-active"
                  : "menu-inactive bar-inactive"
              }
              onClick={pushToCart}
            >
              <div className="menu-item-names">Personal</div>
            </li>
            <li
              className={
                state.activeCart === 1
                  ? "menu-active food-active"
                  : "food-inactive menu-inactive"
              }
              onClick={pushToCart}
            >
              <div className="menu-item-names">Table</div>
            </li>
          </ul>
          {/* <ul className="menu-btn-cart" style={{ justifyContent: "space-evenly" }}>
            <li onClick={pushToCart}>
              <div
                className={
                  state.activeCart === 0 ? "cart-menu active" : "cart-menu"
                }
              >
                <PersonalSVG height="19px" />
                &nbsp;&nbsp;Personal
              </div>
            </li>
            <li onClick={pushToCart}>
              <div
                className={
                  state.activeCart === 1 ? "cart-menu active" : "cart-menu"
                }
              >
                <TableSVG height="19px" />
                &nbsp;&nbsp;Table
              </div>
            </li>
          </ul> */}
          <div
            onClick={() => {
              dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
              dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
            }}
            className="cart-wrapper"
          >
            {isEmpty() && (
              <div className="empty-cart">
                <EmptyCartSadIMG />
                <p style={{ margin: 0 }}>Who likes rumbling tummy ?</p>
                <p>Neither me.</p>
              </div>
            )}
            {cart.length !== 0 &&
              state.activeCart === 0 &&
              renderPersonalCart()}
            {state.activeCart === 1 && renderTableCart()}
            {state.activeCart === 0 && cart.length !== 0 && (
              <>
                <Bill orderTotal={orderTotal} addOnTotal={addOnTotal} />
                {state.activeCart === 0 && (
                  <Row>
                    <Col style={{ marginTop: "1rem" }}>
                      <div className="bill-btn" onClick={setCartPlaceOrder}>
                        <p>Place Order</p>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "1rem" }}>
                      <div className="bill-btn table-btn" onClick={setCart}>
                        <p>Push To Table</p>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {state.activeCart === 1 && (
              <>
                <Bill orderTotal={sum} />
                <div onClick={setOrderTable} className="bill-btn mt-3">
                  <div className="d-flex">
                    <p className="ml-3">Confirm Order</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const cartWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Cart {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default cartWithSocket;
