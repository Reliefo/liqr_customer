/* eslint-disable */
import React from "react";
import { StoreContext } from "Store";
import { Card } from "react-bootstrap";
import SocketContext from "../socket-context";
import { ReactComponent as AmazonPay } from "assets/amazon.svg";
import { ReactComponent as GooglePay } from "assets/google-pay.svg";
import { ReactComponent as Paytm } from "assets/paytm.svg";
import { ReactComponent as PayPal } from "assets/paypal.svg";
import VisaMaster from "assets/visa2x.png";
import "react-toastify/dist/ReactToastify.css";
import CheckoutForm from "./StripeCheckoutForm";
import "./PaymentOptions.css";
import axios from "axios";
import Lottie from "react-lottie";
import paymentSuccessData from "assets/success-animation.json";
import paymentFailedData from "assets/failed-animation.json";
import paymentProcessingData from "assets/processing-animation.json";

import * as TYPES from "Store/actionTypes.js";

const PaymentOptions = (props) => {
  // $rest-font
  const rest_font = "Inconsolata";

  const SVGLogoClass = "SVG-Logo-Class";
  const [clientSecret, setClientSecret] = React.useState("");
  const [totalAmount, setTotalAmount] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState("");

  const {
    dispatch,
    state: {
      // rawData: { food_menu = [] },
      themeProperties,
    },
  } = React.useContext(StoreContext);
  React.useEffect(() => {
    let bodyFormData = new FormData();
    bodyFormData.set("table_id", localStorage.getItem("table_id"));
    bodyFormData.set("unique_id", localStorage.getItem("unique_id"));

    axios({
      method: "post",
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      // },
      // url: "http://localhost:5050/secret",
      url: "https://liqr.cc/secret",
      data: bodyFormData,
    }).then((response) => {
      const { data } = response;
      setClientSecret(data["client_secret"]);
      setTotalAmount(data["total_amount"]);
      // localStorage.setItem("restaurant_id", data.restaurant_id);
    });

    dispatch({ type: TYPES.SET_GENERAL_DATA, payload: { searchValue: "" } });
    dispatch({ type: TYPES.UPDATE_FAB_CLICK, payload: false });
    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    console.log("Table screen");
    //handling refresh issue
    dispatch({
      type: TYPES.SET_GENERAL_DATA,
      payload: { searchClicked: false },
    });
    dispatch({ type: TYPES.SET_NAV, payload: "Order" });

    /////THEMEING //////
    if (themeProperties["theme"] === true) {
      let cssVariables = [
        "--theme-font",
        "--first-menu-background-color",
        "--second-menu-background-color",
        "--first-pattern-light-color",
        "--second-pattern-light-color",
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(
          item,
          themeProperties["variables"][item]
        );
      });
    }
    /////THEMEING //////
  }, []);

  // const fetchSocketBill = (isTable) => {
  //   const billBody = {
  //     user_id: localStorage.getItem("user_id"),
  //     table_id: localStorage.getItem("table_id"),
  //     table_bill: isTable,
  //   };

  //   props.socket.emit("fetch_the_bill", JSON.stringify(billBody));
  // };

  // const isEmpty = () => {
  //   if (orderSuccess.length === 0) return true;
  // };

  // const [state, setState] = React.useState({
  //   promocode: "",
  // });

  // const handleChange = (event) => {
  //   setState({
  //     [event.target.id]: event.target.value,
  //   });
  // };

  const sendAssistance = (name) => {
    const body = {
      table: localStorage.getItem("table_id"),
      user: localStorage.getItem("user_id"),
      assistance_type: name,
      after_billing: true,
    };

    dispatch({ type: TYPES.UPDATE_MENU_CLICK, payload: false });
    props.socket.emit("assistance_requests", JSON.stringify(body));
  };

  const payingBill = (need) => {
    sendAssistance(need);
    localStorage.removeItem("table_id");
  };
  const paymentSuccessAnimation = {
    loop: false,
    autoplay: true,
    animationData: paymentSuccessData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const paymentFailedAnimation = {
    loop: false,
    autoplay: true,
    animationData: paymentFailedData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const paymentProcessingAnimation = {
    loop: true,
    autoplay: true,
    animationData: paymentProcessingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const afterBilling = () => {
    localStorage.removeItem("table_id");
    localStorage.removeItem("restaurant_id");
  };
  return (
    <>
      <div className="coupons-screen">
        <div style={{ padding: "2rem 1rem 0rem 1rem" }}>
          <b>Total Amount to be Paid: ${totalAmount}</b>
        </div>
        <Card className="cart-card cart-styling payments-card">
          <Card.Title className="payments-card-title">
            Credit/ Debit Cards
          </Card.Title>
          <Card.Body className="payments-card-body">
            {/* < className={SVGLogoClass}/> */}
            {/* <img
              src={VisaMaster}
              style={{ height: "1.5rem", width: "5rem" }}
            ></img> */}
            <Card.Text style={{ marginBottom: "0.2rem" }}>
              Powered by Stripe
            </Card.Text>
            <CheckoutForm
              clientSecret={clientSecret}
              setPaymentStatus={setPaymentStatus}
              afterBilling={afterBilling}
            />
          </Card.Body>
        </Card>
        {paymentStatus === "success" ? (
          <div className="payment-status">
            <Lottie options={paymentSuccessAnimation} width="33%"/>
            <strong>Payment Successful</strong>
          </div>
        ) : paymentStatus === "failed" ? (
          <div className="payment-status">
            <Lottie options={paymentFailedAnimation} width="33%"/>
            <strong>Payment Failed</strong>
          </div>
        ) : paymentStatus === "processing" ? (
        // ) : true ? (
          <div className="payment-status">
            <Lottie options={paymentProcessingAnimation} width="33%"/>
            <strong>Processing your payment</strong>
          </div>
        ) : (
          ""
        )}
        {false && (
          <div>
            <div className="coupon-div cart-styling">
              Wallets
              <div style={{ minHeight: "60px", paddingTop: "5%" }}>
                <AmazonPay className={SVGLogoClass} />
                <span
                  style={{
                    fontSize: "12px",
                    float: "right",
                    fontFamily: rest_font,
                  }}
                >
                  Link Account
                </span>
              </div>
              <div style={{ minHeight: "60px", paddingTop: "5%" }}>
                <Paytm className={SVGLogoClass} />
                <span
                  style={{
                    fontSize: "12px",
                    float: "right",
                    fontFamily: rest_font,
                  }}
                >
                  Link Account
                </span>
              </div>
              <div style={{ minHeight: "60px", paddingTop: "5%" }}>
                <PayPal className={SVGLogoClass} />
                <span
                  style={{
                    fontSize: "12px",
                    float: "right",
                    fontFamily: rest_font,
                  }}
                >
                  Link Account
                </span>
              </div>
              <div style={{ minHeight: "60px", paddingTop: "5%" }}>
                {/* <span className="paymentLogo">Logo</span>{" "}
            <span style={{ fontSize: "12px", fontFamily: rest_font }}>
              Google Pay
            </span> */}
                <GooglePay className={SVGLogoClass} />
                <span
                  style={{
                    fontSize: "12px",
                    float: "right",
                    fontFamily: rest_font,
                  }}
                >
                  Link Account
                </span>
              </div>
            </div>
            <Card className="cart-card cart-styling payments-card">
              <Card.Title className="payments-card-title">
                <div style={{ float: "left" }}>NET BANKING</div>
              </Card.Title>
              <Card.Body className="payments-card-body">
                <div>
                  <span className="paymentLogo">SC</span>&nbsp;&nbsp;
                  <span className="paymentLogo">BB</span>&nbsp;&nbsp;
                  <span className="paymentLogo">BJB</span>&nbsp;&nbsp;
                  <span className="paymentLogo">CIMB</span>&nbsp;&nbsp;
                  <span className="paymentLogo">HSBC</span>&nbsp;&nbsp;
                </div>
              </Card.Body>
            </Card>

            <Card className="cart-card cart-styling payments-card">
              <Card.Title className="payments-card-title">
                Pay directly at the Restaurant
              </Card.Title>
              <Card.Body className="payments-card-body">
                <button
                  className="pay-directly-buttons btn btn-warning"
                  onClick={() => payingBill("Cash Only")}
                >
                  Cash Only
                </button>
                <br></br>
                <br></br>
                <button
                  className="pay-directly-buttons btn btn-warning"
                  onClick={() => payingBill("By Card")}
                >
                  By Card
                </button>
                <br></br>
                <br></br>
                <button
                  className="pay-directly-buttons btn btn-warning"
                  onClick={() => payingBill("By UPI, bring the QR Code")}
                >
                  By UPI
                </button>
                <br></br>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

const PaymentWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <PaymentOptions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default PaymentWithSocket;
