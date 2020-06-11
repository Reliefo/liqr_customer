/* eslint-disable no-unused-expressions */
import React from "react";
import { StoreContext } from "Store";
import { Card, Accordion, Button } from "react-bootstrap";
import SocketContext from "../socket-context";
import LoaderButton from "../components/LoaderButton";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";

import * as TYPES from "Store/actionTypes.js";
import { auto, left } from "@popperjs/core";

const BillingInformation = props => {
  const {
    dispatch,
    state: {
      rawData: { food_menu = [] },
      searchClicked,
      restName
    }
  } = React.useContext(StoreContext);

  let billing = [];
  billing.push(props.location.state.data);
  localStorage.removeItem("table_id");

  React.useEffect(() => {
    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    console.log("Billing Information screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false }
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });
  }, []);

  const handleDoc = pdf => {
    window.open(pdf);
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
          style={{ backgroundColor: "white" }}
        >
          <div className="order-status-styling">
            {billing.map((item, idx) => {
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
                          style={{
                            float: "left",
                            textTransform: "capitalize",
                            fontWeight: 700
                          }}
                        >
                          {restName}
                        </p>
                        <p
                          className="table-name-card"
                          style={{
                            paddingRight: "5%",
                            float: "right",
                            textTransform: "capitalize"
                          }}
                        ></p>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          padding: "2%",
                          minHeight: "70px"
                        }}
                      >
                        <p
                          className="table-name-card"
                          style={{
                            float: "left",
                            textTransform: "capitalize",
                            fontWeight: 700
                          }}
                        >
                          Order Total <br />₹{" "}
                          {item.bill_structure["Total Amount"]}
                        </p>
                      </div>
                      {item.table_orders.map(item2 => {
                        return item2.orders.map(item4 => {
                          let placedBy = [];
                          return item4.food_list.map((item3, index) => {
                            let flag = false;
                            if (!placedBy.includes(item4.placed_by.id)) {
                              placedBy.push(item4.placed_by.id);
                              flag = true;
                            } else {
                              flag = false;
                            }
                            return (
                              <div>
                                {flag === true ? (
                                  <Card.Title
                                    style={{
                                      padding: "0.85rem",
                                      fontSize: "14px"
                                    }}
                                    className="card-title-name"
                                  >
                                    {item4.placed_by.name}
                                  </Card.Title>
                                ) : (
                                  ""
                                )}
                                <Card.Body style={{ padding: "2%" }}>
                                  <div>
                                    <span className="item-status">
                                      {item3.name} x {item3.quantity}
                                    </span>
                                  </div>
                                  {item3.food_options ? (
                                    <div
                                      style={{
                                        fontFamily: "Poppins",
                                        fontSize: "12px"
                                      }}
                                    >
                                      {
                                        item3.food_options.options[0]
                                          .option_name
                                      }
                                      {item3.food_options.choices[0] &&
                                      item3.food_options.options[0].option_name
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
                        });
                      })}
                    </div>
                    <hr />
                    <div
                      style={{
                        float: "left",
                        height: "25px",
                        paddingLeft: "2%",
                        width: "100%",
                        margin: "0 auto"
                      }}
                    >
                      <p
                        className="table-name-card-billing"
                        style={{
                          float: "left",
                          width: "40%",
                          textTransform: "capitalize"
                        }}
                      >
                        <b>Order Total</b>
                      </p>
                      <p
                        className="table-name-card-billing"
                        style={{
                          float: "right",
                          paddingRight: "10%",
                          height: "25px"
                        }}
                      >
                        <b> ₹ {item.bill_structure["Total Amount"]}</b>
                      </p>
                    </div>
                    <div
                      style={{
                        float: "left",
                        paddingLeft: "2%",
                        height: "25px",
                        width: "100%",
                        margin: "0 auto"
                      }}
                    >
                      <p
                        className="table-name-card-billing"
                        style={{
                          float: "left",
                          width: "40%",

                          textTransform: "capitalize"
                        }}
                      >
                        <b>CGST</b>
                      </p>
                      <p
                        className="table-name-card-billing"
                        style={{ float: "right", paddingRight: "10%" }}
                      >
                        <b> {item.taxes["CGST"]}%</b>
                      </p>
                    </div>
                    <div
                      style={{
                        float: "left",
                        paddingLeft: "2%",
                        height: "25px",
                        width: "100%",
                        margin: "0 auto"
                      }}
                    >
                      <p
                        className="table-name-card-billing"
                        style={{
                          float: "left",
                          width: "40%",
                          textTransform: "capitalize"
                        }}
                      >
                        <b>SGST</b>
                      </p>
                      <p
                        className="table-name-card-billing"
                        style={{ float: "right", paddingRight: "10%" }}
                      >
                        <b> {item.taxes["SGST"]}%</b>
                      </p>
                    </div>
                    <div
                      style={{
                        float: "left",
                        paddingLeft: "2%",

                        width: "100%",
                        margin: "0 auto"
                      }}
                    >
                      <p
                        className="table-name-card-billing"
                        style={{
                          float: "left",
                          width: "40%",
                          textTransform: "capitalize"
                        }}
                      >
                        <b>Service Charge</b>
                      </p>
                      <p
                        className="table-name-card-billing"
                        style={{ float: "right", paddingRight: "10%" }}
                      >
                        <b> {item.taxes["Service"]}%</b>
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
            <LoaderButton
              block
              bsSize="large"
              onClick={() => {
                handleDoc(billing[0].pdf);
              }}
              type="button"
              text="View Bill"
              style={{
                float: "left",
                margin: "0 auto",
                width: "45%"
              }}
              className="empty-orders"
            />
            <LoaderButton
              block
              bsSize="large"
              onClick={() => {
                props.history.push("/coupons");
              }}
              type="button"
              text="Pay Now"
              style={{
                float: "right",
                margin: "0 auto",
                width: "45%"
              }}
              className="empty-orders"
            />
          </div>
        </div>
      )}
    </>
  );
};

const BillingSocket = props => (
  <SocketContext.Consumer>
    {socket => <BillingInformation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default BillingSocket;
