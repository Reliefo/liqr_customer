import React, { Component } from "react";
import ReactDOM from "react-dom";
// import { Button } from "react-bootstrap";
import AppWrapper from "../App";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import OTPComponent from "./OTP";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloading: false,
      email: "",
      password: "",
      errorMessage: "",
    };
  }

  UNSAFE_componentDidMount() {
    let parm = window.location.href;
    parm = parm.split("=");

    if (
      localStorage.getItem("registeredUser") === "true" &&
      localStorage.getItem("table_id") !== null
    ) {
      if (parm[1] !== undefined) {
        let bodyFormData = new FormData();
        bodyFormData.set("table_id", parm[1]);
        bodyFormData.set("email_id", localStorage.getItem("email_id"));
        bodyFormData.set("unique_id", localStorage.getItem("unique_id"));
        axios({
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
          url: "https://liqr.cc/refresh",
          data: bodyFormData,
        }).then((response) => {
          const { data } = response;

          localStorage.setItem("table_id", parm[1]);
          localStorage.setItem("restaurant_id", data.restaurant_id);
          ReactDOM.render(<AppWrapper />, document.getElementById("root"));
          this.props.history.push("/home", {
            login: true,
          });
        });
      } else {
        ReactDOM.render(<AppWrapper />, document.getElementById("root"));
        this.props.history.push("/home", {
          login: true,
        });
      }
    } else if (
      localStorage.getItem("registeredUser") === "false" &&
      localStorage.getItem("table_id") !== null
    ) {
      if (parm[1] !== undefined) {
        let bodyFormData = new FormData();
        bodyFormData.set("table_id", parm[1]);
        bodyFormData.set("email_id", "dud");
        bodyFormData.set("unique_id", localStorage.getItem("unique_id"));

        axios({
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
          url: "https://liqr.cc/refresh",
          data: bodyFormData,
        }).then((response) => {
          const { data } = response;
          localStorage.setItem("table_id", parm[1]);
          localStorage.setItem("restaurant_id", data.restaurant_id);
          ReactDOM.render(<AppWrapper />, document.getElementById("root"));
        });
      } else {
        ReactDOM.render(<AppWrapper />, document.getElementById("root"));
      }
    }
  }
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  skipSignIn = async (event) => {
    event.preventDefault();
    let parm = window.location.href;
    parm = parm.split("=");
    let table_id =
      parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id");
    const uniqueId = `${uuidv4().substring(0, 15)}`;
    if (localStorage.getItem("unique_id") === null) {
      localStorage.setItem("unique_id", uniqueId);
    } else {
      localStorage.setItem("unique_id", localStorage.getItem("unique_id"));
    }
    let bodyFormData = new FormData();
    bodyFormData.set(
      "unique_id",
      localStorage.getItem("unique_id") !== null
        ? localStorage.getItem("unique_id")
        : uniqueId
    );
    bodyFormData.set("password", "wask");
    bodyFormData.set("email_id", "dud");
    bodyFormData.set(
      "table_id",
      parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id")
    );
    axios({
      method: "post",
      url: "https://liqr.cc/user_login",
      data: bodyFormData,
    })
      .then((response) => {
        const { data } = response;
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("table_id", table_id);
        localStorage.setItem("restaurant_id", data.restaurant_id);
        localStorage.setItem("unique_id", data.unique_id);
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        ReactDOM.render(<AppWrapper />, document.getElementById("root"));
        this.props.history.push("/home", {
          login: true,
        });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  render() {
    //$base-font
    return (
      <div >
        <OTPComponent props={this.props} fromLogin={true} skipSignIn={this.skipSignIn} />
      </div>
    );
  }
}
