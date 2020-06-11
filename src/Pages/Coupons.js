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

const Coupons = props => {
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

    // props.socket.off("billing").on("billing", msg => {
    //   const ms = JSON.parse(msg);
    //   const { order_history } = ms;
    //   props.history.push("/billing", {
    //     data: order_history
    //   });
    //   const { message } = ms;

    //   toast.info(message, {
    //     position: "top-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined
    //   });
    // });

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
      <div className="order-status-styling">
        <div className="coupon-div">
          <FormGroup controlId="promocode" bsSize="large">
            <label className="sign-in-label">Enter Discount Code</label>
            <FormControl
              style={{
                fontSize: "15px",
                fontFamily: "Poppins"
              }}
              placeholder="Promotion Code"
              autoFocus
              value={state.promocode}
              onChange={handleChange}
              type="text"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            onClick={() => {
              props.history.push("/paymentOptions");
            }}
            type="button"
            text="Apply Now"
            style={{
              margin: "0 auto",
              width: "100%"
            }}
            className="empty-orders"
          />
          <LoaderButton
            block
            bsSize="large"
            onClick={() => {
              props.history.push("/paymentOptions");
            }}
            type="button"
            text="Skip"
            style={{
              margin: "0 auto",
              width: "100%"
            }}
            className="sign-in-google"
          />
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
            <div style={{ float: "left" }}>Payment Option Logo</div>
            <div
              style={{
                border: "1px dotted black",
                float: "right",
                padding: "2%"
              }}
            >
              TEST50
            </div>
          </Card.Title>
          <Card.Body
            style={{
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            Promo Code Description
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
            <div style={{ float: "left" }}>Payment Option Logo</div>
            <div
              style={{
                border: "1px dotted black",
                float: "right",
                padding: "2%"
              }}
            >
              TEST50
            </div>
          </Card.Title>
          <Card.Body
            style={{
              fontSize: "12px",
              fontFamily: "Poppins"
            }}
          >
            Promo Code Description
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

const CouponsWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Coupons {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default CouponsWithSocket;
