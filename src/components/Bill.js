import React from "react";
import { Card } from "react-bootstrap";

const Bill = ({ orderTotal, addOnTotal }) => {

  //$rest-font
  const rest_font = "Inconsolata"; 
  let tax = 0;

  tax = (11 * parseFloat(orderTotal)) / 100;
  return (
    <Card className="cart-bill cart-styling">
      <Card.Title
        className="pl-3 pt-3  bill-details-class"
        style={{ fontWeight: 600 }}
      >
        Bill Details
      </Card.Title>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 0.5,
              fontWeight: 500,
            }}
          >
            Order total
          </p>
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 1,
              fontWeight: 600,
            }}
          >
            &#8377; {orderTotal}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 0.5,
              fontWeight: 500,
            }}
          >
            Addon total
          </p>
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 1,
              fontWeight: 600,
            }}
          >
            &#8377; {addOnTotal}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 0.5,
              fontWeight: 500,
            }}
          >
            Taxes & Charges
          </p>
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 1,
              fontWeight: 600,
            }}
          >
            &#8377; {tax}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 0.5,
              fontWeight: 500,
            }}
          >
            Pay
          </p>
          <p
            style={{
              fontFamily: rest_font,
              color: "#000000",
              opacity: 1,
              fontWeight: 600,
            }}
          >
            &#8377; {orderTotal + tax + addOnTotal}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};
export default Bill;
