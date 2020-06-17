import React, { useState, useEffect } from "react";
import "./App.scss";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "axios";
import Home from "./Pages/Home";
import Coupons from "./Pages/Coupons";
import PaymentOptions from "./Pages/PaymentOptions";
import SubMenu from "./Pages/SubMenu";
import Menu from "./Pages/Menu";
import JM from "./Pages/jm";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Cart from "./Pages/Cart";
import Table from "./Pages/Table";
import Visits from "./Pages/Visits";
import BillingInformation from "./Pages/BillingInformation";
import SearchItems from "./Pages/searchItems";
import DineHistory from "./Pages/dineHistory";
import PreviousVisits from "./Pages/PreviousVisits";
import "./styles.css";
import "./components/Login.css";
import { Store } from "Store";
import NavBar from "components/NavBar";
import FooterNav from "components/FooterNav";
import * as TYPES from "Store/actionTypes.js";
import SocketContext from "./socket-context";
import { StoreContext } from "Store";
import io from "socket.io-client";

export default function AppWrapper() {
  const socket = io("https://liqr.cc/reliefo", {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      }
    }
  });

  axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
    },
    url: "https://liqr.cc/refresh"
  }).then(response => {
    const { data } = response;

    localStorage.setItem("jwt", data.access_token);

    //Start the timer
  });

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Store>
          <NavBar outerContainerId={"App"} />
          <Route path="/" render={props => <Login {...props} />} exact />
          <Route path="/Home" render={props => <Home {...props} />} exact />
          <Route path="/menu" render={props => <Menu {...props} />} exact />
          <Route path="/login" render={props => <Login {...props} />} exact />
          <Route
            path="/coupons"
            render={props => <Coupons {...props} />}
            exact
          />
          <Route
            path="/paymentOptions"
            render={props => <PaymentOptions {...props} />}
            exact
          />

          <Route
            path="/register"
            render={props => <SignUp {...props} />}
            exact
          />
          <Route
            path="/searchItems"
            render={props => <SearchItems {...props} />}
            exact
          />
          <Route path="/cart" render={props => <Cart {...props} />} exact />
          <Route path="/jm" render={props => <JM {...props} />} exact />
          <Route path="/visits" render={props => <Visits {...props} />} exact />
          <Route
            path="/billing"
            render={props => <BillingInformation {...props} />}
            exact
          />
          <Route path="/table" render={props => <Table {...props} />} />
          <Route path="/subMenu" render={props => <SubMenu {...props} />} />
          <Route
            path="/dine-in-history"
            render={props => <DineHistory {...props} />}
          />
          <Route
            path="/previous-visits"
            render={props => <PreviousVisits {...props} />}
          />
          <Route path="/order" render={props => <Table {...props} />} />

          <FooterNav />
        </Store>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}
