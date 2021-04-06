import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormLabel, FormControl, Form } from "react-bootstrap";
import { Link } from "react-router-dom"
import Button from "components/CustomButton/CustomButton.jsx";
import bgImage from "../../assets/img/full-screen-image-2.jpg";

export default class Login extends Component {
    render() {
        return (
            <div className="auth-wrapper vh-100" style={{ backgroundImage: "url(" + bgImage + ")", backgroundSize: "cover", backgroundPosition: "center center"}}>
                <div className="auth-inner" data-image={bgImage}>
                    <Form onSubmit={this.handleLogin}>
                        <h3>Sign In</h3>

                        <FormGroup>
                            <FormLabel>Email address</FormLabel>
                            <FormControl placeholder="Email Address" name="email" type="email"
                                       autoComplete="off" onChange={this.handleChangeInput}/>
                        </FormGroup>

                        <FormGroup className="mb-0">
                            <FormLabel>Password</FormLabel>
                            <FormControl placeholder="Password" name="password" type="password" autoComplete="off"
                                       onChange={this.handleChangeInput}/>
                        </FormGroup>

                        {/* <FormGroup>
                            <div className="custom-control custom-checkbox">
                                <FormControl type="checkbox" className="custom-control-input" id="customCheck1" />
                                <FormLabel className="custom-control-label" htmlFor="customCheck1">Remember me</FormLabel>
                            </div>
                        </FormGroup> */}
                        <p className="forgot-password text-right pt-0 pb-5">
                            Forgot <a href="#">password?</a>
                        </p>
                        <FormGroup className="d-flex">
                            <div className="mx-auto">
                                <Button variant="success" fill wd>Sign in</Button>
                            </div>
                        </FormGroup>
                        <p className="forgot-password text-center pt-0">
                            Don't have an account?  <Link to="/auth/register">Sign up</Link>
                        </p>
                        
                    </Form>
                </div>                
            </div>
        );
    }
}
