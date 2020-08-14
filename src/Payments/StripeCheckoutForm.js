import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import { Button } from "react-bootstrap";

import CardSection from './StripeAcceptCard';

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    console.log(props['clientSecret']);
    if (!stripe || !elements) {
      console.log("Not ready yet");
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(props['clientSecret'], {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Johnny Rose',
        },
      }
    });
    console.log(result);

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <Button type="submit" style={{marginTop:".5rem", width:"100%"}} disabled={!stripe}>Confirm and Pay</Button>
    </form>
  );
}
