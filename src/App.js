import React from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Cart from "./Pages/Cart";
import Table from "./Pages/Table";

import { Store } from "Store";
import NavBar from "components/NavBar";
import FooterNav from "components/FooterNav";

const App = () => {
  return (
    <BrowserRouter>
      <Store>
        <NavBar />
        <Route path="/" children={<Home />} exact />
        <Route path="/menu" children={<Menu />} exact />
        <Route path="/cart" children={<Cart />} exact />
        <Route path="/table" children={<Table />} />
        <FooterNav />
      </Store>
    </BrowserRouter>
  );
};

export default App;
