import React from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
// import axios from "axios";
import Home from "./Pages/Home";
import Coupons from "./Pages/Coupons";
import PaymentOptions from "./Payments/PaymentOptions";
import SubMenu from "./Pages/SubMenu";
import Menu from "./Pages/Menu";
import Status from "./Pages/Status";
import Profile from "./Pages/Profile";
// import JM from "./Pages/jm";
// import Login from "./components/Login";
import Login from "./components/LoginPhone";
import SignUp from "./components/SignUp";
import Cart from "./Pages/Cart";
import Visits from "./Pages/Visits";
import BillingInformation from "./Pages/BillingInfo";
import SearchItems from "./Pages/searchItems";
import DineHistory from "./Pages/dineHistory";
import PreviousVisits from "./Pages/PreviousVisits";
import "./styles.css";
import "./components/Login.css";
import { Store } from "Store";
import NavBar from "components/NavBar";
import FooterNav from "components/FooterNav";
import SocketContext from "./socket-context";
import io from "socket.io-client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51H4JNtEjtenrp5aUxpEp2MSpjBkEV2kShuErrlJ8ditbLDiio1158ezK2DL1oIXS69LQLjhgfA3Saehn1KPqqEsP003ZLdFsZ7"
);

const AppWrapper = () => {
  const socket = io("https://liqr.cc/reliefo", {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      },
    },
  });
  console.disableYellowBox = true;
  // axios({
  //   method: "post",
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
  //   },
  //   url: "https://liqr.cc/refresh",
  // }).then((response) => {
  //   const { data } = response;

  //   localStorage.setItem("jwt", data.access_token);

  //   //Start the timer
  // });

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Store>
            <NavBar outerContainerId={"App"} />
            <Route path="/" render={(props) => <Login {...props} />} exact />
            <Route path="/home" render={(props) => <Home {...props} />} exact />
            <Route path="/menu" render={(props) => <Menu {...props} />} />
            <Route
              path="/login"
              render={(props) => <Login {...props} />}
              exact
            />
            <Route
              path="/coupons"
              render={(props) => <Coupons {...props} />}
              exact
            />
            <Route
              path="/paymentOptions"
              render={(props) => <PaymentOptions {...props} />}
              exact
            />

            <Route
              path="/register"
              render={(props) => <SignUp {...props} />}
              exact
            />
            <Route
              path="/searchItems"
              render={(props) => <SearchItems {...props} />}
              exact
            />
            <Route path="/cart" render={(props) => <Cart {...props} />} exact />
            {/* <Route path="/jm" render={(props) => <JM {...props} />} exact /> */}
            <Route
              path="/visits"
              render={(props) => <Visits {...props} />}
              exact
            />
            <Route
              path="/billing"
              render={(props) => <BillingInformation {...props} />}
              exact
            />
            <Route path="/table" render={(props) => <Status {...props} />} />
            <Route path="/profile" render={(props) => <Profile {...props} />} />
            <Route path="/subMenu" render={(props) => <SubMenu {...props} />} />
            <Route
              path="/dine-in-history"
              render={(props) => <DineHistory {...props} />}
            />
            <Route
              path="/previous-visits"
              render={(props) => <PreviousVisits {...props} />}
            />
            <Route path="/order" render={(props) => <Status {...props} />} />

            <FooterNav />
          </Store>
        </Elements>
      </BrowserRouter>
    </SocketContext.Provider>
  );
};

export default AppWrapper;
