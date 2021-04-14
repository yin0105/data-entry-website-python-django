
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
} from "react-bootstrap";
import { Link } from "react-router-dom"
import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true
    };
  }
  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardHidden: false });
      }.bind(this),
      700
    );
  }
  render() {
    return (
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
            <form>
              <Card
                hidden={this.state.cardHidden}
                textCenter
                title="Register"
                content={
                  <div>
                    <FormGroup>
                      <FormLabel>User Name</FormLabel>
                      <FormControl placeholder="Your Full Name" type="text" />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Email address</FormLabel>
                      <FormControl placeholder="Enter email" type="email" />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Password</FormLabel>
                      <FormControl placeholder="Password" type="password" autoComplete="off"/>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Password Confirm</FormLabel>
                      <FormControl
                        type="password"
                        autoComplete="off"
                        placeholder="Password Confirmation"
                      />
                    </FormGroup>
                  </div>
                }
                legend={
                  <FormGroup>
                    <Button variant="primary" fill wd type="submit">
                      Register
                    </Button>
                    <FormText className="text-dark">Do you have an account? <Link to="/frontend/auth/login-page"> Login</Link></FormText>
                  </FormGroup>
                }
                ftTextCenter
              />
            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginPage;
