/* eslint-disable no-unused-expressions */
/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import { Card } from "react-bootstrap";
import SocketContext from "../socket-context";
import LoaderButton from "../components/LoaderButton";
import SearchFoodItems from "components/SearchFoodItems.js";
import "./BillingInfo.css";
import { Table as RBTable } from "react-bootstrap";

import * as TYPES from "Store/actionTypes.js";

const BillingInformation = (props) => {
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [] },
      searchClicked,
      restName,
      currency,
      tableName,
    },
  } = React.useContext(StoreContext);

  let billing = props.location.state.data;
  const [payOffline, setPayOffline] = React.useState(false);

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Billing Information screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });
  }, []);

  const handleDoc = (pdf) => {
    window.open(pdf);
  };
  const afterBilling = () => {
    localStorage.removeItem("table_id");
    localStorage.removeItem("restaurant_id");
  };
  return (
    <>
      {searchClicked === true ? (
        <SearchFoodItems />
      ) : (
        <div
          onClick={() => {
            dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
            dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
          }}
          className="billing-page default-screen"
        >
          <div className="whole-bill-styling">
            <div style={{ paddingBottom: "3%" }}>
              <Card className="cart-card bill-styling margin-styling">
                <div>
                  <div
                    style={{
                      width: "100%",
                      padding: "2%",
                      minHeight: "50px",
                    }}
                  >
                    <p
                      className="billing-headings-card"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: 700,
                      }}
                    >
                      {restName}
                    </p>
                    <p
                      className="billing-headings-card"
                      style={{
                        paddingRight: "5%",
                        textTransform: "capitalize",
                        fontSize: "medium",
                      }}
                    >
                      {tableName}
                    </p>
                  </div>
                  {billing.table_orders.map((tableOrder, tableOrderIndex) => {
                    let orderNo = tableOrderIndex + 1;
                    return (
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>{"Order No: " + orderNo}</strong>
                        <strong
                          style={{
                            float: "right",
                            fontSize: "small",
                            padding: "1%",
                          }}
                        >
                          {"Placed at: " +
                            tableOrder.timestamp.split(" ")[1].split(".")[0]}
                        </strong>
                        {tableOrder.orders.map((order, orderIndex) => {
                          return (
                            <div
                              key={"billing2_" + orderIndex + tableOrderIndex}
                            >
                              <Card.Title className="bill-title-name">
                                {order.placed_by.name}
                              </Card.Title>
                              <Card.Body style={{ padding: "1%" }}>
                                {false &&
                                  order.food_list.map(
                                    (foodItem, foodItemIndex) => {
                                      return (
                                        <div>
                                          <span className="food-item-bill">
                                            {foodItem.name} x{" "}
                                            {foodItem.quantity}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                <RBTable
                                  striped
                                  bordered
                                  hover
                                  className="bill-layout"
                                >
                                  <thead className="table-thead">
                                    <tr>
                                      <th></th>
                                      <th></th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  {order.food_list.map((cartItem, ix) => {
                                    return (
                                      <tbody
                                        key={"cart" + ix}
                                        className="table-body-bill"
                                      >
                                        <tr>
                                          <td>
                                            <strong>
                                              {cartItem.name +
                                                " x " +
                                                cartItem.quantity}
                                            </strong>
                                            <br />
                                            {cartItem.customization &&
                                              cartItem.customization.map(
                                                (cust) => {
                                                  if (
                                                    cust.customization_type ===
                                                    "add_ons"
                                                  ) {
                                                    return (
                                                      <span className="table-cart-detail-options">
                                                        {cust.list_of_options.map(
                                                          (
                                                            option,
                                                            optionIndex
                                                          ) => {
                                                            return (
                                                              <span>
                                                                {
                                                                  cust
                                                                    .list_of_options[
                                                                    optionIndex
                                                                  ].name
                                                                }{" "}
                                                                {currency}
                                                                {
                                                                  cust
                                                                    .list_of_options[
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
                                                          (
                                                            option,
                                                            optionIndex
                                                          ) => {
                                                            if (
                                                              cust.customization_type ===
                                                              "options"
                                                            ) {
                                                              return (
                                                                <span>
                                                                  {
                                                                    cust
                                                                      .list_of_options[
                                                                      optionIndex
                                                                    ]
                                                                      .option_name
                                                                  }
                                                                  {": "}
                                                                  {currency}
                                                                  {
                                                                    cust
                                                                      .list_of_options[
                                                                      optionIndex
                                                                    ]
                                                                      .option_price
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
                                                                    cust
                                                                      .list_of_options[
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
                                                }
                                              )}
                                          </td>
                                          <td>{cartItem.price}</td>
                                        </tr>
                                      </tbody>
                                    );
                                  })}
                                </RBTable>
                              </Card.Body>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <hr />

                <div className="taxes-div">
                  <p className="billing-taxes-name">
                    <b>CGST</b>
                  </p>
                  <p className="billing-taxes-values">
                    <b> {billing.taxes["CGST"]}%</b>
                  </p>
                </div>
                <div className="taxes-div">
                  <p className="billing-taxes-name">
                    <b>SGST</b>
                  </p>
                  <p className="billing-taxes-values">
                    <b> {billing.taxes["SGST"]}%</b>
                  </p>
                </div>
                <div className="taxes-div">
                  <p className="billing-taxes-name">
                    <b>Service Charge</b>
                  </p>
                  <p className="billing-taxes-values">
                    <b> {billing.taxes["Service"]}%</b>
                  </p>
                </div>
                <div className="taxes-div orders-total">
                  <p className="billing-taxes-name">
                    <b>Order Total</b>
                  </p>
                  <p className="billing-taxes-values">
                    <b>
                      {" "}
                      {currency} {billing.bill_structure["Total Amount"]}
                    </b>
                  </p>
                </div>
              </Card>
            </div>
            <LoaderButton
              block
              onClick={() => {
                handleDoc(billing[0].pdf);
              }}
              type="button"
              text="View Bill"
              className="billing-buttons non-important-billing-buttons"
            />
            <LoaderButton
              block
              onClick={() => {
                setPayOffline(true);
                afterBilling();
              }}
              type="button"
              text="Pay Directly, Offline"
              className="billing-buttons non-important-billing-buttons"
            />
            <LoaderButton
              block
              onClick={() => {
                props.history.push("/paymentOptions");
              }}
              type="button"
              text="Pay Online"
              className="billing-buttons"
            />
            { payOffline && <strong className="thank-you-note">Thank you for dining here</strong> }
          </div>
        </div>
      )}
    </>
  );
};

const BillingSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <BillingInformation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default BillingSocket;
