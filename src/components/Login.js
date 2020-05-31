import React, { Component } from "react";
import ReactDOM from "react-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import axios from "axios";
import AppWrapper from "../App";
import { v4 as uuidv4 } from "uuid";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    if ((localStorage.getItem("registeredUser") === "true") && (localStorage.getItem('table_id') !== null)) {
      this.props.history.push("/home", {
        login : true
    });
  }
}
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  skipSignIn = async event => {
    event.preventDefault();
    let jwt = "";
    let parm = window.location.href;
    parm = parm.split("=");
    let table_id =
      parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id");
    const uniqueId = `${uuidv4().substring(0, 15)}`;
    if (localStorage.getItem("unique_id") === null) {
      localStorage.setItem("unique_id", uniqueId);
    }
    let bodyFormData = new FormData();
    bodyFormData.set(
      "unique_id",
      localStorage.getItem("uniqueId") !== null
        ? localStorage.getItem("uniqueId")
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
      data: bodyFormData
    })
      .then(response => {
        const { data } = response;
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("table_id", table_id);
        localStorage.setItem("restaurant_id", data.restaurant_id);
        localStorage.setItem("registeredUser", false);
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        ReactDOM.render(<AppWrapper />, document.getElementById("root"));
        this.props.history.push("/Home");
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    let parm = window.location.href;
    parm = parm.split("=");
    let table_id =
      parm[1] !== undefined ? parm[1] : localStorage.getItem("table_id");
    let bodyFormData = new FormData();
    bodyFormData.set("password", this.state.password);
    bodyFormData.set("unique_id", "");
    bodyFormData.set("email_id", this.state.email);
    bodyFormData.set("table_id", table_id);

    axios({
      method: "post",
      url: "https://liqr.cc/user_login",
      data: bodyFormData
    }).then(response => {
      const { data } = response;
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("table_id", table_id);
      localStorage.setItem("registeredUser", true);
      localStorage.setItem("restaurant_id", data.restaurant_id);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("name", data.name);
      ReactDOM.render(<AppWrapper />, document.getElementById("root"));
      this.props.history.push("/Home");
    });
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div className="Login">
        <div className="sign-in">Sign In</div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <label className="sign-in-label">Email ID</label>
            <FormControl
              style={{
                fontSize: "15px",
                fontFamily: "Poppins"
              }}
              placeholder="sample@emailid.com"
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <label className="sign-in-label">Password</label>
            <FormControl
              style={{
                fontSize: "15px",
                fontFamily: "Poppins"
              }}
              placeholder="********"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            className="sign-in-button"
            loadingText="Logging in…"
          />
        </form>
        <div className="sign-in-or">or</div>
        <div>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Google"
            style={{
              marginRight: "10%",
              float: "left",
              width: "45%"
            }}
            className="sign-in-google"
            loadingText="Logging in…"
          />
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            style={{
              width: "45%"
            }}
            isLoading={this.state.isLoading}
            text="Facebook"
            className="sign-in-facebook"
            loadingText="Logging in…"
          />
        </div>
        <div className="sign-in-member">
          Not a member yet ?{" "}
          <span
            onClick={() => {
              this.props.history.push("/register");
            }}
            style={{ color: "#ffb023" }}
          >
            {" "}
            Sign Up
          </span>
        </div>
        <Button
          block
          bsSize="large"
          style={{ marginTop: "5%" }}
          isLoading={this.state.isLoading}
          text="Skip Sign In"
          onClick={this.skipSignIn}
          className="sign-in-button"
        >
          Skip Sign In
        </Button>
      </div>
    );
  }
}

