/* eslint-disable no-unused-expressions */
// /* eslint-disable */
import React from "react";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import AddRemoveItem from "components/AddRemoveItem.js";
import { StoreContext } from "Store";
import SocketContext from "../socket-context";
import * as TYPES from "Store/actionTypes.js";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as EmptyCartSadIMG } from "assets/empty-card-sad.svg";
import CloseSVG from "components/CloseSVG.js";
import { Table as RBTable } from "react-bootstrap";
import Bill from "components/Bill.js";
import CollapseDetails from "./Collapse.js";
import "./Cart.css";
import OTPComponent from "../components/OTP";

const Cart = (props) => {
  const {
    dispatch,
    state: {
      cart,
      tableCartOrders,
      searchClicked,
      orderingAbility,
      themeProperties,
      currency,
      taxes,
      phoneRegistered,
    },
  } = React.useContext(StoreContext);

  let orderId = [];
  if (tableCartOrders && Object.keys(tableCartOrders).length > 0) {
    Object.values(tableCartOrders.orders).forEach((item) => {
      if (item.food_list.length > 0 && !orderId.includes(item.placed_by.name)) {
        orderId.push(item.placed_by.name);
      }
    });
  }

  const [state, setState] = React.useState({
    activeCart: 0, //0: Personal cart, 1: Table cart
    showData: true,
  });
  // const [registered, setRegistered] = React.useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = React.useState(
    false
  );

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
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });

    /////THEMEING //////

    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-menu-background-color",
        "--second-menu-background-color",
        "--first-pattern-light-color",
        "--second-pattern-light-color",
        "--table-cart-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
      // document.documentElement.style.setProperty("--theme-font", "Inconsolata");
      // document.documentElement.style.setProperty("--first-menu-background-color", "#d6c333");
      // document.documentElement.style.setProperty("--second-menu-background-color", "#d1a926");
      // document.documentElement.style.setProperty("--first-pattern-light-color", "#ffe83d");
      // document.documentElement.style.setProperty("--second-pattern-light-color", "#ffcf31");
    }
    /////THEMEING //////

    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Cart" });
  }, [dispatch, themeProperties]);

  props.socket.off("new_orders").on("new_orders", (msg) => {
    const data = JSON.parse(msg);
    console.log(data);
    if (data.personal_order === undefined) {
      console.log("FUck inside it");
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
      dispatch({
        type: TYPES.UPDATE_TABLE_CART,
        payload: [],
      });
      props.history.push("/table");
    }
    if (data.personal_order === true) {
      if (data.orders[0].placed_by["id"] === localStorage.getItem("user_id")) {
        dispatch({ type: TYPES.RESET_CART });
        props.history.push("/table");
      }
    }
  });

  props.socket.off("table_cart_orders").on("table_cart_orders", (msg) => {
    if (msg !== undefined) {
      dispatch({ type: TYPES.UPDATE_TABLE_CART, payload: JSON.parse(msg) });
      orderId = [];
    }
  });

  // const deleteItemHndlr = (item) => {
  //   dispatch({ type: TYPES.DEL_ITEM, payload: item });
  // };

  const deleteItemHndlrTableCart = (item, orderList) => {
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

  const confirmTheTableOrders = () => {
    const body = { table_id: localStorage.getItem("table_id") };
    props.socket.emit("place_table_order", JSON.stringify(body));
    dispatch({ type: TYPES.UPDATE_TABLE_CART, payload: [] });
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
        dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: resp.food_menu });
        setState((state) => ({ ...state, activeCart: 1 - state.activeCart }));
      });
    });
  };

  const createOrderBody = () => {
    const cartToSend = [];

    cart.forEach((cartItem) => {
      let singleFoodObject = {
        food_id: cartItem._id.$oid,
        price: cartItem.price,
        quantity: cartItem.quantity,
        name: cartItem.name,
        kitchen: cartItem.kitchen,
        restaurant_id: cartItem.restaurant_id,
        customization: [],
      };
      cartItem.currentCustomization?.forEach((cust) => {
        let singleCust = {
          name: cust.name,
          that_number: cust.that_number,
          less_more: cust.less_more,
          list_of_options: [],
          customization_type: cust.customization_type,
        };
        cust.list_of_options.forEach((option, optionIndex) => {
          if (cust.checked[optionIndex]) {
            if (cust.customization_type === "add_ons") {
              singleCust.list_of_options.push(option._id.$oid);
            } else {
              singleCust.list_of_options.push(option);
            }
          }
        });
        singleFoodObject.customization.push(singleCust);
      });

      cartToSend.push(singleFoodObject);
    });
    console.log(cartToSend);

    const body = {
      table: localStorage.getItem("table_id"),
      orders: [
        { placed_by: localStorage.getItem("user_id"), food_list: cartToSend },
      ],
    };
    return body;
  };

  const placePersonalOrder = () => {
    // const cartClone = _.cloneDeep(cart);
    const body = createOrderBody();
    // console.log(body);

    props.socket.emit("place_personal_order", JSON.stringify(body));
    props.socket.off("new_orders").on("new_orders", (msg) => {
      console.log(msg);
      const body = {
        user_id: localStorage.getItem("user_id"),
        restaurant_id: localStorage.getItem("restaurant_id"),
      };

      props.socket.emit("fetch_rest_customer", JSON.stringify(body));

      props.socket.off("restaurant_object").on("restaurant_object", (data) => {
        const resp = JSON.parse(data);
        dispatch({ type: TYPES.ADD_DATA, payload: resp });
        dispatch({ type: TYPES.ADD_TO_CART_DATA, payload: resp.food_menu });
      });
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
      dispatch({ type: TYPES.RESET_CART });
      props.history.push("/table");
    });
  };

  const pushToTable = () => {
    const body = createOrderBody();

    const body1 = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id"),
    };

    props.socket.emit("push_to_table_cart", JSON.stringify(body));

    props.socket.emit("fetch_rest_customer", JSON.stringify(body1));

    props.socket.off("table_details").on("table_details", (msg) => {
      const data = JSON.parse(msg);
      dispatch({ type: TYPES.UPDATE_TABLE_CART, payload: data.table_cart });
    });

    dispatch({ type: TYPES.RESET_CART });
    setState((state) => ({ ...state, activeCart: 1 - state.activeCart }));
  };

  const renderPersonalCart = () => (
    <>
      {cart.map((cartItem, idx) => (
        <Card className="cart-card cart-styling" key={`cart-card-${idx}`}>
          <Card.Body className="cart-item-body body">
            <p className="name">{cartItem.name}</p>
            <AddRemoveItem
              className="trial"
              count={cartItem.quantity}
              foodId={cartItem.foodId}
              allData={cartItem}
            />
            <p style={{ margin: 0, width: "15%", float: "right" }}>
              {currency} {cartItem.price * cartItem.quantity}
            </p>
            {/* <div
              style={{ padding: ".5rem" }}
              onClick={deleteItemHndlr.bind(this, cartItem)}
            >
              <CloseSVG />
            </div> */}
          </Card.Body>
          {cartItem.currentCustomization &&
            cartItem.currentCustomization.map((cust, custIndex) => {
              if (cust.customization_type === "add_ons") {
                return (
                  <span className="detail-options" key={"cust-table-cart-"+custIndex}>
                    {cust.checked.includes(true) ? cust.name + ":  " : ""}
                    {cust.list_of_options.map((option, optionIndex) => {
                      if (cust.checked[optionIndex]) {
                        return (
                          <strong key={"detail-ops-" + optionIndex}>
                            {cust.list_of_options[optionIndex].name} {currency}
                            {cust.list_of_options[optionIndex].price}
                            {", "}
                          </strong>
                        );
                      } else {
                        return "";
                      }
                    })}
                  </span>
                );
              } else {
                return (
                  <span className="detail-options" key={"cust-table-cart-"+custIndex}>
                    {cust.name + ":  "}
                    {cust.list_of_options.map((option, optionIndex) => {
                      if (cust.checked[optionIndex]) {
                        if (cust.customization_type === "options") {
                          return (
                            <strong key={"detail-ops-" + optionIndex}>
                              {cust.list_of_options[optionIndex].option_name}{" "}
                              {currency}
                              {cust.list_of_options[optionIndex].option_price}
                              {", "}
                            </strong>
                          );
                        } else if (cust.customization_type === "choices") {
                          return (
                            <strong key={"detail-ops-" + optionIndex}>
                              {cust.list_of_options[optionIndex]}
                              {", "}
                            </strong>
                          );
                        } else {
                          return "";
                        }
                      } else {
                        return "";
                      }
                    })}
                  </span>
                );
              }
            })}
          <span className="detail-instructions">
            {" "}
            <CollapseDetails item={cartItem} />
          </span>

          <hr className="cart-hr" />
        </Card>
      ))}
    </>
  );
  const renderTableCart = () => (
    <>
      {orderId.map((id) => {
        return Object.entries(tableCartOrders).map((item2, idx) => {
          if (item2[0] === "orders") {
            return item2[1].map((order_list, index) => {
              if (order_list.placed_by.name === id) {
                return (
                  <React.Fragment key={`table-${index}`}>
                    {id}
                    <RBTable
                      striped
                      bordered
                      hover
                      className="table-cart-layout"
                    >
                      <thead className="table-thead">
                        <tr>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      {order_list.food_list.map((cartItem, ix) => {
                        console.log(cartItem);
                        return (
                          <tbody key={"cart" + ix}>
                            <tr>
                              <td style={{ padding: "0.2rem" }}>
                                <strong>{cartItem.name}</strong>
                                <br />
                                {cartItem.customization &&
                                  cartItem.customization.map((cust) => {
                                    if (cust.customization_type === "add_ons") {
                                      return (
                                        <span className="table-cart-detail-options">
                                          {cust.list_of_options.map(
                                            (option, optionIndex) => {
                                              return (
                                                <span>
                                                  {
                                                    cust.list_of_options[
                                                      optionIndex
                                                    ].name
                                                  }{" "}
                                                  {currency}
                                                  {
                                                    cust.list_of_options[
                                                      optionIndex
                                                    ].price
                                                  }
                                                  {", "}
                                                </span>
                                              );
                                            }
                                          )}
                                        </span>
                                      );
                                    } else {
                                      return (
                                        <span className="table-cart-detail-options">
                                          {/* {cust.name + ":  "} */}
                                          {cust.list_of_options.map(
                                            (option, optionIndex) => {
                                              if (
                                                cust.customization_type ===
                                                "options"
                                              ) {
                                                return (
                                                  <span>
                                                    {
                                                      cust.list_of_options[
                                                        optionIndex
                                                      ].option_name
                                                    }
                                                    {": "}
                                                    {currency}
                                                    {
                                                      cust.list_of_options[
                                                        optionIndex
                                                      ].option_price
                                                    }
                                                    {", "}
                                                  </span>
                                                );
                                              } else if (
                                                cust.customization_type ===
                                                "choices"
                                              ) {
                                                return (
                                                  <span>
                                                    {
                                                      cust.list_of_options[
                                                        optionIndex
                                                      ]
                                                    }
                                                    {", \n"}
                                                  </span>
                                                );
                                              } else {
                                                return "";
                                              }
                                            }
                                          )}
                                          <br />
                                        </span>
                                      );
                                    }
                                  })}
                              </td>
                              <td>{cartItem.quantity}</td>
                              <td>{cartItem.price}</td>
                              <td
                                onClick={deleteItemHndlrTableCart.bind(
                                  this,
                                  cartItem,
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
              } else {
                return "";
              }
            });
          } else {
            return "";
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

  let sum = 0;
  tableCartOrders && Object.keys(tableCartOrders).length > 0
    ? Object.entries(tableCartOrders).forEach((item) => {
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
  const showRegistration = () => {
    setShowRegistrationModal(true);
  };
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
      ) : orderingAbility === false ? (
        <div className="cart-screen">
          <p className="cart-styling">
            Ordering has been disabled by the restaurant manager
          </p>
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          className="cart-screen"
        >
          <nav className="food-bar-menu">
            <ul className="menu-btn">
              <li
                className={
                  state.activeCart === 0
                    ? "menu-active food-menu-button bottom-border-active"
                    : "menu-inactive food-menu-button bottom-border-inactive"
                }
                onClick={pushToCart}
              >
                <div className="menu-item-names">Personal</div>
              </li>
              <li
                className={
                  state.activeCart === 1
                    ? "menu-active bar-menu-button bottom-border-active"
                    : "menu-inactive bar-menu-button bottom-border-inactive"
                }
                onClick={pushToCart}
              >
                <div className="menu-item-names">Common</div>
              </li>
            </ul>
          </nav>
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
            {!phoneRegistered && (
              <Modal
                size="lg"
                centered
                show={showRegistrationModal}
                onHide={() => {
                  setShowRegistrationModal(false);
                }}
              >
                <div className="login-modal-div">
                  <OTPComponent fromLogin={false} />
                </div>
              </Modal>
            )}
            {state.activeCart === 0 && cart.length !== 0 && (
              <>
                <Bill
                  orderTotal={orderTotal}
                  taxes={taxes}
                  currency={currency}
                />
                {state.activeCart === 0 && (
                  <Row style={{ paddingBottom: "6rem" }}>
                    <Col style={{ marginTop: "1rem" }}>
                      <div
                        className="bill-btn personal-order-btn"
                        onClick={
                          phoneRegistered
                            ? placePersonalOrder
                            : showRegistration
                        }
                      >
                        <p>Place Order</p>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "1rem" }}>
                      <div
                        className="bill-btn push-to-table-btn"
                        onClick={
                          phoneRegistered ? pushToTable : showRegistration
                        }
                      >
                        <p>Push To Table</p>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {state.activeCart === 1 && (
              <>
                <Bill orderTotal={sum} taxes={taxes} currency={currency} />
                <div
                  onClick={confirmTheTableOrders}
                  className="bill-btn push-to-table-btn mt-3"
                >
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
