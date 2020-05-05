import React from "react";
import { ReactComponent as MinuSVG } from "assets/minus.svg";
import { ReactComponent as MyPlusSVG } from "assets/myPlus.svg";
import SocketContext from "../socket-context";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

//decHndlr and incHndlr are for parent.(we are using it in case of plusWithAddRemove COmponent)
const AddRemoveItem =  props => {
  const { dispatch } = React.useContext(StoreContext);

  const increase = () => {
    dispatch({
      type: TYPES.INC_ITEM,
      payload: props.id
    });
    if (props.incHndlr) {
      props.incHndlr();
    }
  };
  const decrease = () => {
    if (props.count-1 === 0) {
      dispatch({
        type: TYPES.DEL_ITEM,
        payload: props.id
      });
  
      const bodyData = {
        user_id: localStorage.getItem("user_id"),
        restaurant_id: "BNGHSR0001"
      };
  
      props.socket.emit("fetch_rest_customer", JSON.stringify(bodyData));
  
      props.socket.off("restaurant_object").on("restaurant_object", data => {
        const resp = JSON.parse(data);
        dispatch({ type: TYPES.ADD_DATA, payload: resp });
        dispatch({ type: TYPES.ADD_SELECT_DATA, payload: resp.food_menu });
  
      });

    };
    dispatch({
      type: TYPES.DEC_ITEM,
      payload: props.id
    });


    if (props.decHndlr) {
      props.decHndlr();
    }
  };
  return (
    <div
      className={`d-flex ${props.className}`}
      style={{ fontWeight: 600, ...props.wrapperStyles }}
    >
      <div className="icon">
        <MinuSVG onClick={decrease} className={props.svgClassName} />
      </div>
      {props.count}
      <div className="icon">
        <MyPlusSVG onClick={increase} className={props.svgClassName} />
      </div>
    </div>
  );
};


const AddRemoveItemWithSocket = props => {
  return (
  <SocketContext.Consumer>
    {socket => <AddRemoveItem {...props} socket={socket} />}
  </SocketContext.Consumer>
  )
};


export default AddRemoveItemWithSocket;
