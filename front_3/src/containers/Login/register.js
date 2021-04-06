import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormLabel, FormControl, Form} from "react-bootstrap";
import { Link } from "react-router-dom"
import Button from "components/CustomButton/CustomButton.jsx";
import bgImage from "../../assets/img/full-screen-image-2.jpg";

export default class Register extends Component {
    render() {
        return (
            <div className="auth-wrapper vh-100" style={{ backgroundImage: "url(" + bgImage + ")", backgroundSize: "cover", backgroundPosition: "center center"}}>
                <div className="auth-inner" data-image={bgImage}>
                    <Form onSubmit={this.handleLogin}>
                        <h3>Sign Up</h3>

                        <FormGroup>
                            <FormLabel>User name</FormLabel>
                            <FormControl placeholder="User name" name="username" type="text"
                                       autoComplete="off" onChange={this.handleChangeInput}/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Email address</FormLabel>
                            <FormControl placeholder="Email Address" name="email" type="email"
                                       autoComplete="off" onChange={this.handleChangeInput}/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <FormControl placeholder="Password" name="password" type="password" autoComplete="off"
                                       onChange={this.handleChangeInput}/>
                        </FormGroup>

                        <FormGroup className="mb-5">
                            <FormLabel>Password Confirm</FormLabel>
                            <FormControl placeholder="Password" name="password_confirm" type="password" autoComplete="off"
                                       onChange={this.handleChangeInput}/>
                        </FormGroup>

                        <FormGroup className="d-flex">
                            <div className="mx-auto">
                                <Button variant="success" fill wd>Sign up</Button>
                            </div>
                        </FormGroup>
                        <p className="forgot-password text-center pt-0">
                            Already have an account?  <Link to="/auth/login">Sign in</Link>
                            {/* <a href="/sign-in">Sign in</a> */}
                        </p>
                        
                    </Form>
                </div>                
            </div>
        );
    }
}
