import React from "react";
import { StoreContext } from "Store";
import {
  Card,
  Accordion,
  Button,
  Modal,
  FormGroup,
  FormControl
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocketContext from "../socket-context";
import SearchFoodItems from "components/SearchFoodItems.js";
import { ReactComponent as FoodSVG } from "assets/food.svg";
import { ReactComponent as FlatSVG } from "assets/Flat.svg";
import { ReactComponent as UiSVG } from "assets/ui.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as TYPES from "Store/actionTypes.js";

const PaymentOptions = props => {
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
    promocode: ""
  });

  const handleChange = event => {
    setState({
      [event.target.id]: event.target.value
    });
  };
  return (
    <>
      <div className="order-status-styling" style={{ fontFamily: "Poppins" }}>
        <div className="coupon-div">
          Wallets
          <div style={{ minHeight: "60px", paddingTop: "5%" }}>
            <span className="paymentLogo">Logo</span>{" "}
            <span style={{ fontSize: "12px", fontFamily: "Poppins" }}>
              Amazon Pay
            </span>
            <span
              style={{
                fontSize: "12px",
                float: "right",
                fontFamily: "Poppins"
              }}
            >
              Link Account
            </span>
          </div>
          <div style={{ minHeight: "60px", paddingTop: "5%" }}>
            <span className="paymentLogo">Logo</span>{" "}
            <span style={{ fontSize: "12px", fontFamily: "Poppins" }}>
              Paytm
            </span>
            <span
              style={{
                fontSize: "12px",
                float: "right",
                fontFamily: "Poppins"
              }}
            >
              Link Account
            </span>
          </div>
          <div style={{ minHeight: "60px", paddingTop: "5%" }}>
            <span className="paymentLogo">Logo</span>{" "}
            <span style={{ fontSize: "12px", fontFamily: "Poppins" }}>
              PayPal
            </span>
            <span
              style={{
                fontSize: "12px",
                float: "right",
                fontFamily: "Poppins"
              }}
            >
              Link Account
            </span>
          </div>
          <div style={{ minHeight: "60px", paddingTop: "5%" }}>
            <span className="paymentLogo">Logo</span>{" "}
            <span style={{ fontSize: "12px", fontFamily: "Poppins" }}>
              Google Pay
            </span>
            <span
              style={{
                fontSize: "12px",
                float: "right",
                fontFamily: "Poppins"
              }}
            >
              Link Account
            </span>
          </div>
        </div>
        <Card
          style={{ marginTop: "5%", background: "white", borderRadius: "8px" }}
          className="cart-card cart-styling"
        >
          <Card.Title
            style={{
              padding: "1.25rem",
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            <div style={{ float: "left" }}>NET BANKING</div>
          </Card.Title>
          <Card.Body
            style={{
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            <div>
              <span className="paymentLogo">SC</span>&nbsp;&nbsp;
              <span className="paymentLogo">BB</span>&nbsp;&nbsp;
              <span className="paymentLogo">BJB</span>&nbsp;&nbsp;
              <span className="paymentLogo">CIMB</span>&nbsp;&nbsp;
              <span className="paymentLogo">HSBC</span>&nbsp;&nbsp;
            </div>
          </Card.Body>
        </Card>
        <Card
          style={{ marginTop: "5%", background: "white", borderRadius: "8px" }}
          className="cart-card cart-styling"
        >
          <Card.Title
            style={{
              padding: "1.25rem",
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            <div style={{ float: "left" }}>Credit/ Debit Cards</div>
          </Card.Title>
          <Card.Body
            style={{
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            Add New
          </Card.Body>
        </Card>
        <Card
          style={{ marginTop: "5%", background: "white", borderRadius: "8px" }}
          className="cart-card cart-styling"
        >
          <Card.Title
            style={{
              padding: "1.25rem",
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            <div style={{ float: "left" }}>Pay the Restaurant</div>
          </Card.Title>
          <Card.Body
            style={{
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            Cash Only
            <label style={{ float: "right" }}>
              <input id={"test"} type="radio" checked={false} />
            </label>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

const PaymentWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <PaymentOptions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default PaymentWithSocket;
