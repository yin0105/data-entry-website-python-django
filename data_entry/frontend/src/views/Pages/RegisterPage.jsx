import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Form,
} from "react-bootstrap";
import { FormFeedback } from "reactstrap";
import { Link } from "react-router-dom"
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'
import axios from 'axios'


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
        username: '',
        email: '',
        password: '',
        passwordCofirm: '',
      }
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

  handleRegister = e => {
    e.preventDefault();

    let username = e.target.elements.username.value;
    let email = e.target.elements.email.value;
    let password = e.target.elements.password.value;
    let passwordConfirm = e.target.elements.password_confirm.value;
    let errors = this.state.errors;
    const queryString = require('query-string');
    let parsed = queryString.parse(this.props.location.search);

    if (username === '') {
      errors.username = 'User name is required';
      this.setState({errors});
      return;
    } else {
      errors.username = '';
      this.setState({errors})
    }

    if (email === '') {
      errors.email = 'Email is required';
      this.setState({errors});
      return;
    } else {
      errors.email = '';
      this.setState({errors})
    }

    if (password === '') {
      errors.password = 'Password is required';
      this.setState({errors});
      return;
    } else {
      errors.password = '';
      this.setState({errors})
    }

    if (passwordConfirm === '') {
      errors.passwordConfirm = 'Please enter password again.';
      this.setState({errors});
      return;
    } else {
      errors.passwordConfirm = '';
      this.setState({errors})
    }

    if (passwordConfirm != password) {
      errors.passwordConfirm = 'Password does not match.';
      this.setState({errors});
      return;
    } else {
      errors.passwordConfirm = '';
      this.setState({errors})
    }

    axios.get('/api/accounts/users/')
      .then(res => {
        console.log("res = ", res)
        let usernameDuplicated = false, emailDuplicated = false
        res.data.map((user) => {
          if (usernameDuplicated || emailDuplicated) return
          if (user.username == username) {
            usernameDuplicated = true
            return
          }
          if (user.email == email) {
            emailDuplicated = true
            return
          }
        })
        if (usernameDuplicated) {
          this.createNotification('error', 'Username is duplicated.', '')
          return
        }
        if (emailDuplicated) {
          this.createNotification('error', 'Email is duplicated.', '')
          return
        }

        let form_data = new FormData();
        form_data.append('username', username);
        form_data.append('email', email);
        form_data.append('password', password);
        form_data.append('role', 'data_collector');
        let url = '/api/accounts/users/';
        axios.post(url, form_data)
          .then(res => {
            this.createNotification('success', 'User has registered successfully!', '')
            return
          }).catch(err => {
            this.createNotification('error', 'Unknow Register Error', '')
            return
          })
      });


    // this.props.login(username, password)
    //   .then(
    //     async(res) => {
    //       const token = loadFromLocalStorage("token");
    //       const headers = { 
    //         'Authorization': 'token ' + token,
    //       };

    //       await axios.get('/api/data_entry/api_cache/?query=sports', {'headers': headers})
    //       .then(res => {
    //         const sports_ids = JSON.parse(res.data[0].data)
    //         saveToLocalStorage("sports_ids", sports_ids.sports)
    //       });

    //       await this.props.get_userinfo()
    //         .then(
    //           () => {
    //             console.log("######## get_userinfo() :: Success");
    //           }
    //         ).catch(
    //           err => {
    //             console.log("Get UserInfo Error");
    //           }

    //         );
    //     }
    //   ).catch(err => {
    //     console.log("Login Error:::");
    //     console.log(err.response);
    //   });
  };

  createNotification = (type, title, content) => {
    switch (type) {
        case 'info':
        return NotificationManager.info(content);
        case 'success':
        return NotificationManager.success(content, title);
        case 'warning':
        return NotificationManager.warning(content, title, 3000);
        case 'error':
        return NotificationManager.error(content, title, 5000);
    }
  };

  render() {
    let {errors} = this.state;
    return (
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
            <Form onSubmit={this.handleRegister}>
              <Card
                hidden={this.state.cardHidden}
                textCenter
                title="Register"
                content={
                  <div>
                    <FormGroup>
                      <FormLabel>User Name</FormLabel>
                      <FormControl placeholder="Your Full Name" type="text" name="username" />
                      <FormFeedback className="text-danger">{errors.username}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Email address</FormLabel>
                      <FormControl placeholder="Enter email" type="email" name="email" />
                      <FormFeedback className="text-danger">{errors.email}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Password</FormLabel>
                      <FormControl placeholder="Password" type="password" autoComplete="off" name="password"/>
                      <FormFeedback className="text-danger">{errors.password}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Password Confirm</FormLabel>
                      <FormControl type="password" autoComplete="off" placeholder="Password Confirmation" name="password_confirm"/>
                      <FormFeedback className="text-danger">{errors.passwordConfirm}</FormFeedback>
                    </FormGroup>
                  </div>
                }
                legend={
                  <FormGroup>
                    <Button variant="primary" fill wd type="submit">
                      Register
                    </Button>
                    <FormText className="text-dark">Do you have an account? <Link to="/auth/login-page"> Login</Link></FormText>
                  </FormGroup>
                }
                ftTextCenter
              />
            </Form>
          </Col>
        </Row>
        <NotificationContainer/>
      </Container>
    );
  }
}

export default LoginPage;
