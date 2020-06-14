import React from "react";

const Loader = props => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFB023 0% 0% no-repeat padding-box"
      }}
    >
      <span>Loading ...</span>
    </div>
  );
};

export default Loader;
