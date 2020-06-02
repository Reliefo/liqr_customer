import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import ReactDOM from "react-dom";
import LoaderButton from "../components/LoaderButton";
import axios from "axios";
import AppWrapper from "../App";
import { v4 as uuidv4 } from "uuid";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const uniqueId = `${uuidv4().substring(0, 15)}`;
    let bodyFormData = new FormData();
    bodyFormData.set("unique_id", uniqueId);
    bodyFormData.set("password", this.state.password);
    bodyFormData.set("email_id", this.state.email);
    bodyFormData.set("name", this.state.name);
    bodyFormData.set("table_id", localStorage.getItem("table_id"));

    axios({
      method: "post",
      url: "https://liqr.cc/user_register",
      data: bodyFormData
    }).then(response => {
      const { data } = response;
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem('unique_id', uniqueId)
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("name", data.name);
      ReactDOM.render(<AppWrapper />, document.getElementById("root"));
      this.props.history.push("/");
    });
    this.setState({ isLoading: false });
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <label className="sign-in-label">Confirmation Code</label>
          <FormControl
            style={{
              fontSize: "15px",
              fontFamily: "Poppins"
            }}
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <label className="sign-in-label">
            Please check your email for the code.
          </label>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="sign-in">Sign Up</div>
        <FormGroup controlId="email" bsSize="large">
          <label className="sign-in-label">Email</label>
          <FormControl
            style={{
              fontSize: "15px",
              fontFamily: "Poppins"
            }}
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
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <label className="sign-in-label">Confirm Password</label>
          <FormControl
            style={{
              fontSize: "15px",
              fontFamily: "Poppins"
            }}
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <label className="sign-in-label">Name</label>
          <FormControl
            style={{
              fontSize: "15px",
              fontFamily: "Poppins"
            }}
            value={this.state.name}
            onChange={this.handleChange}
            type="name"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Sign Up"
          className="sign-in-button"
          loadingText="Logging in…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Login">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
