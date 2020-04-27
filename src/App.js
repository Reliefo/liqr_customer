import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SubMenu from "./Pages/SubMenu";
import Menu from "./Pages/Menu";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Cart from "./Pages/Cart";
import Table from "./Pages/Table";
import "./styles.css";
import "./components/Login.css";
import { Store } from "Store";
import NavBar from "components/NavBar";
import FooterNav from "components/FooterNav";
import * as TYPES from "Store/actionTypes.js";
import SocketContext from "./socket-context";
import { StoreContext } from "Store";
import io from "socket.io-client";

const socket = io(
  "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo",
  {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODc5OTc3MzIsIm5iZiI6MTU4Nzk5NzczMiwianRpIjoiMzc4NDU0OTItNGMyZS00ZjE5LTk5NGMtYmM4NmMyNTI4NjVhIiwiZXhwIjoxNTg4MDEyNzMyLCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.mn97Um9xAm2eZzkxbuM5Wb_08hMDAs2B5f7mve60KWk"
        }
      }
    }
  }
);

export default function AppWrapper() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Store>
          <NavBar outerContainerId={"App"} />

          <Route path="/" render={props => <Home {...props} />} exact />
          <Route path="/menu" render={props => <Menu {...props} />} exact />
          <Route path="/login" render={props => <Login {...props} />} exact />
          <Route
            path="/register"
            render={props => <SignUp {...props} />}
            exact
          />
          <Route path="/cart" render={props => <Cart {...props} />} exact />
          <Route path="/table" render={props => <Table {...props} />} />
          <Route path="/subMenu" render={props => <SubMenu {...props} />} />
          <Route path="/order" render={props => <Table {...props} />} />
          <FooterNav />
        </Store>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}
