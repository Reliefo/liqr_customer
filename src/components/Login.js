import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { Auth } from "aws-amplify";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const user = await Auth.signIn(this.state.email, this.state.password);
      // console.log(JSON.stringify(user));
      console.log(user);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
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
              width: "45%",
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
          Not a member yet ? <span style= {{ color: '#ffb023' }}> Sign Up</span>
        </div>
        <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            style={{marginTop: '5%'}}
            isLoading={this.state.isLoading}
            text="Skip Sign In"
            className="sign-in-button"
            loadingText="Logging in…"
          />
      </div>
    );
  }
}
