import React from "react";
import "./Loader.css"

const Loader = props => {
  return (
    <div
      className='loading-screen'
    >
      <img className="loading-logo" alt="Welcome to LiQR" src="https://liqr-restaurants.s3.ap-south-1.amazonaws.com/logo.png"
                  />
      <span style={{paddingTop:"1rem"}}>Loading... Please reload if it's taking too long</span>
    </div>
  );
};

export default Loader;
