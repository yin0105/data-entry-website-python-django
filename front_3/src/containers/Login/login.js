import React, { Component } from "react";
import {Button, Grid, Row, Col, FormGroup, FormLabel, FormControl, Form} from "react-bootstrap";
import bgImage from "../../assets/img/full-screen-image.jpg";

export default class Login extends Component {
    render() {
        return (
            <div className="auth-wrapper" style={{ backgroundImage: "url(" + bgImage + ")", backgroundSize: "cover", backgroundPosition: "center center"}}>
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
                            <Button variant="success" className="w-100" type="submit">Sign in</Button>
                        </FormGroup>
                        <p className="forgot-password text-center pt-0">
                            Don't have an account?  <a href="/sign-up">Sign up</a>
                        </p>
                        
                    </Form>
                </div>                
            </div>
        );
    }
}
