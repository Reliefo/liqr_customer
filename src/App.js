import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Cart from "./Pages/Cart";
import Table from "./Pages/Table";
import "./styles.css";
import { Store } from "Store";
import NavBar from "components/NavBar";
import FooterNav from "components/FooterNav";
import socket from './socket';
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";

// const socket = io(
//   "'http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo'",
//   {
//     transportOptions: {
//       polling: {
//         extraHeaders: {
//           Authorization:
//             "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODcxMTY2MTksIm5iZiI6MTU4NzExNjYxOSwianRpIjoiNDlmMzRiMGItODkxOC00ZWJiLWI1ODQtYmRhZWMyZjUyMzMzIiwiZXhwIjoxNTg3MTMxNjE5LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.HObY0Nx5jGs4XjiOhIiUFZ8Jl318ojq1CHdYDBEiNFY",
//             jwt:  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODcxMTY2MTksIm5iZiI6MTU4NzExNjYxOSwianRpIjoiNDlmMzRiMGItODkxOC00ZWJiLWI1ODQtYmRhZWMyZjUyMzMzIiwiZXhwIjoxNTg3MTMxNjE5LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.HObY0Nx5jGs4XjiOhIiUFZ8Jl318ojq1CHdYDBEiNFY",
//         }
//       }
//     }
//   }
// );

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <Store>
        <NavBar outerContainerId={"App"} />
        <App />
        <Route path="/" children={<Home />} exact />
        <Route path="/menu" children={<Menu />} exact />
        <Route path="/cart" children={<Cart />} exact />
        <Route path="/order" children={<Table />} />
        <FooterNav />
      </Store>
    </BrowserRouter>
  );
}



export function App() {
  const {
    dispatch,
    state: { orderStatus }
  } = React.useContext(StoreContext);

  
  socket.on("order_updates", msg => {
    dispatch({ type: TYPES.UPDATE_ORDER_STATUS, payload: JSON.parse(msg) });
  });

  socket.on("new_orders", msg => {
    console.log("GOT A NEW ORDER", msg);
  });



  return <div></div>;
}
