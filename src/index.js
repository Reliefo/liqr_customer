import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppWrapper from "./App";
import * as serviceWorker from "./serviceWorker";
import Amplify from "aws-amplify";
import config from "./config";

// console.log = () => {};

// let jwt = "";
// let parm = window.location.href;
// parm = parm.split("=");

// const uniqueId = `${uuidv4().substring(0, 15)}`;

// let bodyFormData = new FormData();
// bodyFormData.set(
//   "unique_id",
//   localStorage.getItem("uniqueId") !== null
//     ? localStorage.getItem("uniqueId")
//     : uniqueId
// );
// bodyFormData.set("password", "wask");
// bodyFormData.set("email_id", "dud");
// bodyFormData.set(
//   "table_id",
//   parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id")
// );
// axios({
//   method: "post",
//   url:
//     "https://liqr.cc/user_login",
//   data: bodyFormData
// })
//   .then(function(response) {
//     //handle success
//     const { data } = response;
//     jwt = data.jwt;
//     localStorage.setItem("jwt", data.jwt);
//     localStorage.setItem("refreshToken", data.refresh_token);
//     localStorage.setItem(
//       "table_id",
//       parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id")
//     );
//     localStorage.setItem('restaurant_id', data.restaurant_id)
//     localStorage.setItem("user_id", data.user_id);
//     localStorage.setItem("uniqueId", data.unique_id);
//     localStorage.setItem("name", data.name);
//     ReactDOM.render(<AppWrapper />, document.getElementById("root"));
//   })
//   .catch(function(response) {
//     //handle error
//     console.log(response);
//   });
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
});

ReactDOM.render(<AppWrapper />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
