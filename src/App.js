import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Pages/Home";
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
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODc3MjE3OTYsIm5iZiI6MTU4NzcyMTc5NiwianRpIjoiMjYzODBiMjktMDJlNC00ZjFmLWJkZTUtYmViYzY0ODU4ODg5IiwiZXhwIjoxNTg3NzM2Nzk2LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.eduCKuSDQmu1HTF4IrXQC4eLeMyv9y_06EHsjpJZrPs"
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
        <Route path="/" children={<Home />} exact />
        <Route path="/menu" children={<Menu />} exact />
        <Route path="/login" children={<Login />} exact />
        <Route path="/register" children={<SignUp />} exact />
        <Route path="/cart" children={<Cart />} exact />
        <Route path="/table" children={<Table />} />
        <Route path="/order" children={<Table />} />
        <FooterNav />
      </Store>
    </BrowserRouter>
    </SocketContext.Provider>
  );
}
