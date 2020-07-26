import React, { useState, useEffect } from "react";
import { FormControl, Button, InputGroup, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import ReactDOM from "react-dom";
import AppWrapper from "../App";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import awsconfig from "../aws-exports";
import { v4 as uuidv4 } from "uuid";
import "./OTP.css";
Amplify.configure(awsconfig);

/*CloseSVG when imported as ReactComponent , doesn't passes fill prop to svg, hence using the code of that svg itself*/

const NOTSIGNIN = "You are NOT logged in";
const SIGNEDIN = "You have logged in successfully";
const SIGNEDOUT = "You have logged out successfully";
const WAITINGFOROTP = "Enter OTP number";
const VERIFYNUMBER = "Verifying number (Country code +XX needed)";

const OTPComponent = ({ props, fromLogin, skipSignIn }) => {
  const [logged, setLogged] = useState(false);
  const [message, setMessage] = useState("Welcome to LiQR Services");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [session, setSession] = useState(null);
  const [otp, setOtp] = useState("");
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [number, setNumber] = useState("");
  const password = Math.random().toString(10) + "Abc#";
  useEffect(() => {
    Auth.configure({
      // other configurations...
      authenticationFlowType: "CUSTOM_AUTH",
    });
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
    setVerifyOTP(true);
    Auth.signIn(number)
      .then((result) => {
        setSession(result); // Note that this is a new variable
        setMessage(WAITINGFOROTP);
      })
      .catch((e) => {
        if (e.code === "UserNotFoundException") {
          console.log("Sign in user not found");
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
        setVerifyOTP(false);
        setLogged(true);
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
        setLogged(true);
        setSession(null);
      })
      .catch((e) => {
        if (e === "not authenticated") {
          console.log("Sign up user not found");
          setMessage(NOTSIGNIN);
        } else {
          console.log(e.code);
          console.log(e);
          console.error(e);
        }
      });
  };
  const signOut = () => {
    if (user) {
      Auth.signOut();
      setUser(null);
      setOtp("");
      setMessage(SIGNEDOUT);
      setLogged(false);
    } else {
      setMessage(NOTSIGNIN);
    }
  };
  const connectLiQR = () => {
    let query_parameters = window.location.href;
    query_parameters = query_parameters.split("=");
    let table_id =
      query_parameters[1] !== undefined
        ? query_parameters[1]
        : localStorage.getItem("table_id");
    let accessToken = user.signInUserSession["accessToken"]["jwtToken"];
    let idToken = user.signInUserSession["idToken"]["jwtToken"];
    let localUniqueId = localStorage.getItem("unique_id");
    if (localUniqueId === null) {
      const uniqueId = `${uuidv4().substring(0, 15)}`;
      localStorage.setItem("unique_id", uniqueId);
      localUniqueId = uniqueId;
    } else {
      localStorage.setItem("unique_id", localUniqueId);
    }

    let bodyFormData = new FormData();
    bodyFormData.set("name", name);
    bodyFormData.set("unique_id", localUniqueId);
    bodyFormData.set("table_id", table_id);
    bodyFormData.set("from_login", fromLogin);
    axios({
      method: "post",
      url: "https://liqr.cc/phone_login",
      // url: "http://localhost:5050/phone_login",
      data: bodyFormData,
      headers: {
        "X-LiQR-Authorization": accessToken,
        "X-LiQR-ID": idToken,
      },
    })
      .then((response) => {
        const { data } = response;
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("table_id", data.table_id);
        localStorage.setItem("restaurant_id", data.restaurant_id);
        localStorage.setItem("unique_id", data.unique_id);
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        ReactDOM.render(<AppWrapper />, document.getElementById("root"));
        props.history.push("/home", {
          login: true,
        });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  return (
    <div>
      <Button
        className="sign-out-button"
        variant="outline-danger"
        onClick={signOut}
      >
        Sign Out
      </Button>
      <div className="OTP-Component">
        <div className="sign-in">LiQR Login Page</div>
        <p className="status-message-login">
          {message}
          {logged
            ? (localStorage.getItem("name") == null
                ? ""
                : " as " + localStorage.getItem("name")) +
              " with ******" +
              user?.attributes["phone_number"].slice(-4)
            : ""}
        </p>
        {!logged && (
          <div>
            <p className="country-code-desc">(With your country code +XX)</p>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Phone Number (+XX)"
                onChange={(event) => setNumber(event.target.value)}
              />
              <InputGroup.Append>
                <Button className="get-otp-button" onClick={signIn}>
                  Get OTP
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {!logged && verifyOTP && (
          <div>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Your OTP"
                onChange={(event) => setOtp(event.target.value)}
              />
              <InputGroup.Append>
                <Button className="confirm-otp" onClick={verifyOtp}>
                  Confirm
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {logged && (
          <div>
            <ButtonGroup className="two-buttons">
              <FormControl
                className="name-placeholder"
                placeholder="Your Name"
                onChange={(event) => setName(event.target.value)}
              />
              <Button className="refresh-sign-in" onClick={verifyAuth}>
                Refresh Login
              </Button>
              <Button className="continue-with-otp" onClick={connectLiQR}>
                {localStorage.getItem("name") == null
                  ? "Sign In"
                  : "Continue as " + localStorage.getItem("name")}
              </Button>
            </ButtonGroup>
          </div>
        )}
        {!logged && (
          <div>
            <div className="sign-in-or">or</div>
            <Button
              block
              // style={{ marginTop: "5%" }}
              // isloading={this.state.isloading}
              text="Skip Sign In"
              onClick={skipSignIn}
              className="sign-in-button"
            >
              {" "}
              {localStorage.getItem("registeredUser") !== null ? (
                localStorage.getItem("registeredUser") === "false" ? (
                  <div>Continue as {localStorage.getItem("name")}</div>
                ) : (
                  "Skip Sign In"
                )
              ) : (
                "Skip Sign In"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPComponent;
