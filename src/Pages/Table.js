import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button, Modal } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as TYPES from "Store/actionTypes.js";

const Table = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      orderSuccess,
      searchClicked,
      tableUsers
    }
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    console.log("Table screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });

    props.socket.off("new_orders").on("new_orders", msg => {
      dispatch({ type: TYPES.UPDATE_SUCCESS_ORDER, payload: JSON.parse(msg) });
    });

    props.socket.off("billing").on("billing", msg => {
      const ms = JSON.parse(msg);
      const { order_history } = ms;
      props.history.push("/billing", {
        data: order_history
      });
      const { message } = ms;

      toast.info(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    });

    const body = {
      user_id: localStorage.getItem("user_id"),
      restaurant_id: localStorage.getItem("restaurant_id")
    };

    props.socket.emit("fetch_rest_customer", JSON.stringify(body));

    props.socket.off("table_details").on("table_details", msg => {
      const data = JSON.parse(msg);
      dispatch({ type: TYPES.REFRESH_ORDER_CLOUD, payload: data.table_orders });
    });

    props.socket.off("order_updates").on("order_updates", msg => {
      dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
    });
  }, []);

  const fetchSocketBill = isTable => {
    const billBody = {
      user_id: localStorage.getItem("user_id"),
      table_id: localStorage.getItem("table_id"),
      table_bill: isTable
    };

    props.socket.emit("fetch_the_bill", JSON.stringify(billBody));
  };

  const isEmpty = () => {
    if (orderSuccess.length === 0) return true;
  };

  const [state, setState] = React.useState({
    showData: true
  });

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
      ) : isEmpty() ? (
        <div className="order-status-styling">
          <div className="empty-cart">
            <p style={{ margin: 10 }}>
              Oops looks like you have no orders placed?
            </p>
            <p style={{ margin: 10 }}>
              Click on the below buttons to get started
            </p>
            <div>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => {
                  props.history.push("/home");
                }}
                type="button"
                text="Home"
                style={{
                  marginRight: "10%",
                  float: "left",
                  width: "45%"
                }}
                className="empty-orders"
              />
              <LoaderButton
                block
                onClick={() => {
                  props.history.push("/menu");
                }}
                bsSize="large"
                type="button"
                style={{
                  width: "45%"
                }}
                text="Menu"
                className="empty-orders"
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          style={{ backgroundColor: "white" }}
        >
          <div className="order-status-styling">
            <div style={{ paddingBottom: "10%" }}>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you would like to bill this item?"
                    )
                  ) {
                    fetchSocketBill(false);
                  }
                }}
                type="button"
                text="Fetch Individual Bill"
                style={{
                  marginRight: "10%",
                  float: "left",
                  width: "48%"
                }}
                className="empty-orders"
              />
              <LoaderButton
                block
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you would like to bill this item?"
                    )
                  ) {
                    fetchSocketBill(true);
                  }
                }}
                bsSize="large"
                type="button"
                style={{
                  width: "42%"
                }}
                text="Fetch Table Bill"
                className="empty-orders"
              />
            </div>

            {orderSuccess.map((item, idx) => {
              let orderTime = item.timestamp.split(" ");

              orderTime = orderTime[1].split(".");

              return (
                <div style={{ paddingBottom: "3%" }}>
                  <Card className="cart-card cart-styling margin-styling">
                    <div>
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "50px"
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{ float: "left", textTransform: "capitalize" }}
                        >
                          Table Order {idx + 1}
                        </p>
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize"
                          }}
                        >
                          {orderTime[0]}
                        </p>
                      </div>
                      {item.orders.map(item2 => {
                        let placedBy = [];
                        return item2.food_list.map((item3, index) => {
                          let flag = false;
                          if (!placedBy.includes(item2.placed_by.id)) {
                            placedBy.push(item2.placed_by.id);
                            flag = true;
                          } else {
                            flag = false;
                          }
                          return (
                            <div>
                              {flag === true ? (
                                <Card.Title
                                  style={{
                                    padding: "1.25rem",
                                    fontSize: "14px"
                                  }}
                                  className="card-title-name"
                                >
                                  {item2.placed_by.name}
                                </Card.Title>
                              ) : (
                                ""
                              )}
                              <Card.Body style={{ padding: "2%" }}>
                                <div>
                                  <span className="item-status">
                                    {item3.name} x {item3.quantity}
                                  </span>
                                  <span className="item-status-tagging">
                                    {item3.status}{" "}
                                    {item3.status === "completed" ? (
                                      <FoodSVG />
                                    ) : item3.status === "queued" ? (
                                      <UiSVG />
                                    ) : (
                                      <FlatSVG />
                                    )}{" "}
                                  </span>
                                </div>
                                {item3.food_options ? (
                                  <div
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "12px"
                                    }}
                                  >
                                    {item3.food_options.options.length > 0
                                      ? item3.food_options.options[0]
                                          .option_name
                                      : ""}
                                    {item3.food_options.choices[0] &&
                                    item3.food_options.options.length > 0
                                      ? "," + item3.food_options.choices[0]
                                      : ""}
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* {item3.food_options ? 
                                <div style={{
                                  fontFamily: 'Poppins',
                                  fontSize: '12px'
                                }}>
                                 {item3.food_options.choices[0].option_name}
                                </div>
                                : ''} */}
                              </Card.Body>
                            </div>
                          );
                        });
                      })}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

const tableWthSocket = props => (
  <SocketContext.Consumer>
    {socket => <Table {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default tableWthSocket;
