/* eslint-disable */
import React from "react";
import PlusWithAddRemove from "components/PlusWithAddRemove";
import AddRemoveItem from "components/AddRemoveItem.js";
import { Card, Modal, Button } from "react-bootstrap";
import * as TYPES from "Store/actionTypes.js";
import { StoreContext } from "Store";
import "./FoodItem.css";
import { uniqBy } from "lodash";


const FoodItem = ({ foodItem, index, subsIndex, restOrderingAbility }) => {
    const {
      dispatch,
      state: {
        // rawData: { food_menu = [], bar_menu = [] },
        cartData,
        addons,
        cart,
      },
    } = React.useContext(StoreContext);
}