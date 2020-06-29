import React from "react";

const Loader = props => {
  return (
    <div
      className='loading-screen'
    >
      <img className="loading-logo" src="https://liqr-restaurants.s3.ap-south-1.amazonaws.com/BNGKOR004/logo.png"
                  />
      {/* <span>Loading ...</span> */}
    </div>
  );
};

export default Loader;
