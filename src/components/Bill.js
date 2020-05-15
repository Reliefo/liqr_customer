import React from "react";
import { Card } from "react-bootstrap";

const Bill = ({orderTotal }) => (
  <Card className="cart-bill cart-styling">
    <Card.Title className="pl-3 pt-3  bill-details-class" style={{ fontWeight: 600 }}>
      Bill Details
    </Card.Title>
    <Card.Body>
      <div className="d-flex justify-content-between">
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 0.5 ,fontWeight: 500 }}>Order total</p>
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 1 ,fontWeight: 600 }}>&#8377; {orderTotal}</p>
      </div>
      <div className="d-flex justify-content-between">
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 0.5 ,fontWeight: 500 }}>Taxes & Charges</p>
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 1 ,fontWeight: 600 }}>&#8377; 50</p>
      </div>
      <div className="d-flex justify-content-between">
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 0.5 ,fontWeight: 500 }}>Pay</p>
      <p style={{ fontFamily: 'Poppins' , color: '#000000' , opacity: 1 ,fontWeight: 600 }}>&#8377; {orderTotal + 50}</p>
      </div>
    </Card.Body>
  </Card>
);
export default Bill;