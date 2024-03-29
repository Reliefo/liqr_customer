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
      payload: props.foodId
    });
    if (props.incHndlr) {
      props.incHndlr();
    }
  };
  const decrease = () => {
    if (props.count-1 === 0) {
      dispatch({
        type: TYPES.DEL_ITEM,
        payload: props.foodId
      });

    };
    dispatch({
      type: TYPES.DEC_ITEM,
      payload: props.foodId
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
