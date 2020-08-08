import React from "react";
import { Button } from "react-bootstrap";
import "./LoaderButton.css";

export default ({
  isloading,
  text,
  loadingtext,
  className = "",
  disabled = false,
  ...props
}) => (
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isloading}
    {...props}
  >
    {!isloading ? text : loadingtext}
  </Button>
);
