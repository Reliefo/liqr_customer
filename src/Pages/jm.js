import React from "react";
import SocketContext from "../socket-context";
import "../../node_modules/react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';


const JM = props => {
  
  const images = [
    {
      original: 'http://lorempixel.com/1000/600/nature/1/',
      thumbnail: 'http://lorempixel.com/250/150/nature/1/',
    },
    {
      original: 'http://lorempixel.com/1000/600/nature/2/',
      thumbnail: 'http://lorempixel.com/250/150/nature/2/'
    },
    {
      original: 'http://lorempixel.com/1000/600/nature/3/',
      thumbnail: 'http://lorempixel.com/250/150/nature/3/'
    }
  ]
  return (
    <>
       <div className="order-status-styling">
       <ImageGallery items={images} />
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
