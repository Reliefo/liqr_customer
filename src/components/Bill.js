import React from "react";
import { Card } from "react-bootstrap";

const Bill = ({ orderTotal, taxes, currency }) => {

  //$rest-font
  const rest_font = "Inconsolata";
  let tax = 0;

  let totalTaxes = 0;
  Object.keys(taxes).forEach((key, value)=>{
    totalTaxes+=taxes[key]
  })
  tax = (totalTaxes * parseFloat(orderTotal)) / 100;
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
            {currency} {orderTotal}
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
            {currency} {tax}
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
            {currency} {orderTotal + tax}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};
export default Bill;
