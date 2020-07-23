import React, { useState, useEffect } from 'react';
import { FormControl, Button, InputGroup, ButtonGroup } from "react-bootstrap";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);
/*CloseSVG when imported as ReactComponent , doesn't passes fill prop to svg, hence using the code of that svg itself*/
const NOTSIGNIN = "You are NOT logged in";
const SIGNEDIN = "You have logged in successfully";
const SIGNEDOUT = "You have logged out successfully";
const WAITINGFOROTP = "Enter OTP number";
const VERIFYNUMBER = "Verifying number (Country code +XX needed)";

const OTPComponent = ({}) => {
  const [message, setMessage] = useState("Welcome to Demo");
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [otp, setOtp] = useState("");
  const [number, setNumber] = useState("");
  const password = Math.random().toString(10) + "Abc#";
  useEffect(() => {
    verifyAuth();
  }, []);

  const signUp = async () => {
    const result = await Auth.signUp({
      username: number,
      password,
      attributes: {
        phone_number: number,
      },
    }).then(() => signIn()); // After signUp, we are going to signIn()
    return result;
  };
  const signIn = () => {
    setMessage(VERIFYNUMBER);
    Auth.signIn(number)
      .then((result) => {
        setSession(result); // Note that this is a new variable
        setMessage(WAITINGFOROTP);
      })
      .catch((e) => {
        if (e.code === "UserNotFoundException") {
          signUp(); // Note that this is a new function to be created later
        } else if (e.code === "UsernameExistsException") {
          setMessage(WAITINGFOROTP);
          signIn();
        } else {
          console.log(e.code);
          console.error(e);
        }
      });
  };
  const verifyOtp = () => {
    Auth.sendCustomChallengeAnswer(session, otp)
      .then((user) => {
        setUser(user); // this is THE cognito user
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        setMessage(err.message);
        setOtp("");
        console.log(err);
      });
  };
  const verifyAuth = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage(NOTSIGNIN);
      });
  };
  const signOut = () => {
    if (user) {
      Auth.signOut();
      setUser(null);
      setOtp("");
      setMessage(SIGNEDOUT);
    } else {
      setMessage(NOTSIGNIN);
    }
  };

  return (
    <div>
      <p>Some message here</p>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Phone Number (+XX)"
            onChange={(event) => setNumber(event.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={signIn}>
              Get OTP
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Your OTP"
            onChange={(event) => setOtp(event.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={verifyOtp}>
              Confirm
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={verifyAuth}>
            Am I sign in?
          </Button>
          <Button variant="outline-danger" onClick={signOut}>
            Sign Out
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default OTPComponent;