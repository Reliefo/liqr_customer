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
    images: [],
    restName: "",
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
      images: imagesData,
      restName: data.name
    })
  });
},[0])

  
  return (
    <>
      <div>
        <a href="https://solutions.liqr.cc">
            <img style={{width:'15%', float:'left'}} src='https://liqr-restaurants.s3.ap-south-1.amazonaws.com/liqr_logo.jpg' alt="liqr"/>
        </a>
        <div style={{textAlign:'center', fontSize:'36px', fontFamily:'Poppins'}}>
          <strong>{state.restName}</strong>
        </div>
      </div>
     
        
        <div style={{paddingTop:'10%'}}>
        <ImageGallery thumbnailPosition="bottom" items={state.images} />
     
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
