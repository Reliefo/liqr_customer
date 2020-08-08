import React from "react";
import { StoreContext } from "Store";
import {
  Card,
  FormGroup,
  FormControl
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocketContext from "../socket-context";
import "react-toastify/dist/ReactToastify.css";

import * as TYPES from "Store/actionTypes.js";

const Coupons = props => {
  const {
    dispatch,
    state: {
      // rawData: { food_menu = [] },
      themeProperties,
    }
  } = React.useContext(StoreContext);


  // $rest-font 
  const rest_font = "Inconsolata";
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
    /////THEMEING //////
    if (themeProperties['theme'] === true) {
      let cssVariables = [
        '--theme-font', 
        '--first-menu-background-color', 
        '--second-menu-background-color', 
        '--first-pattern-light-color', 
        '--second-pattern-light-color', 
      ];
      cssVariables.forEach((item, key) => {
        // console.log(item,key);
        document.documentElement.style.setProperty(item, themeProperties['variables'][item]);
      });
    }
    /////THEMEING //////
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
  }, [ dispatch, props.socket, themeProperties ]);

  // const fetchSocketBill = isTable => {
  //   const billBody = {
  //     user_id: localStorage.getItem("user_id"),
  //     table_id: localStorage.getItem("table_id"),
  //     table_bill: isTable
  //   };

  //   props.socket.emit("fetch_the_bill", JSON.stringify(billBody));
  // };

  // const isEmpty = () => {
  //   if (orderSuccess.length === 0) return true;
  // };

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
      <div className="coupons-screen">
        <div className="coupon-div cart-styling">
          <FormGroup controlId="promocode" bsSize="large">
            <label className="sign-in-label">Enter Discount Code</label>
            <FormControl
              style={{
                fontSize: "15px",
                fontFamily: rest_font
              }}
              placeholder="Promotion Code"
              value={state.promocode}
              onChange={handleChange}
              type="text"
            />
          </FormGroup>
          <LoaderButton
            block
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
          style={{ marginTop: "5%", borderRadius: "8px" }}
          className="cart-card cart-styling"
        >
          <Card.Title
            style={{
              padding: "1.25rem",
              fontSize: "12px",
              fontFamily: rest_font
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
              fontFamily: rest_font
            }}
          >
            Promo Code Description
          </Card.Body>
        </Card>
        <Card
          style={{ marginTop: "5%", borderRadius: "8px" }}
          className="cart-card cart-styling"
        >
          <Card.Title
            style={{
              padding: "1.25rem",
              fontSize: "12px",
              fontFamily: rest_font
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
              fontFamily: rest_font
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
