import React from "react";
import SocketContext from "../socket-context";
import "../../node_modules/react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import axios from "axios";
import { StoreContext } from "Store";

const JM = props => {
  const {
    dispatch,
    state: { restId }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    images: []
  });

  React.useEffect(() => {

  let rid = props.location.search;

  rid = rid.split("=");

  axios({
    method: "get",
    url: `https://liqr.cc/get_just_menu/${rid[1]}`
  }).then(response => {
    let imagesData = [];
    const { data } = response;
  
    data.menu.forEach(item => {
      let imageData = {}
      imageData.original = item
      imageData.thumbnail = item
      imagesData.push(imageData)
    })
    setState({
      images: imagesData
    })
  });
},[0])

  
  return (
    <>
      <div className="order-status-styling">
        <ImageGallery items={state.images} />
      </div>
    </>
  );
};

const jmWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <JM {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default jmWithSocket;
