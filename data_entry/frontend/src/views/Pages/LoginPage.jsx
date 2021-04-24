
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
import { Link, Redirect } from 'react-router-dom';

import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";
import { login, getUserInfo, getSportsId } from 'redux/actions/auth.jsx';
import {connect} from "react-redux";
import AuthHelper from 'helpers/authHelper.jsx';
import {validateEmail} from 'helpers/commonHelper.jsx';
import { saveToLocalStorage, loadFromLocalStorage } from 'redux/reducers/auth'
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
        username: '',
        password: ''
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

  handleLogin = e => {
    e.preventDefault();

    let username = e.target.elements.username.value;
    let password = e.target.elements.password.value;
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
    if (password === '') {
      errors.password = 'Password is required';
      this.setState({errors});
      return;
    } else {
      errors.password = '';
      this.setState({errors})
    }

    this.props.login(username, password)
      .then(
        async(res) => {
          const token = loadFromLocalStorage("token");
          const headers = { 
            'Authorization': 'token ' + token,
          };

          await axios.get('/api/data_entry/api_cache/?query=sports', {'headers': headers})
          .then(res => {
            const sports_ids = JSON.parse(res.data[0].data)
            saveToLocalStorage("sports_ids", sports_ids.sports)
          });

          await this.props.get_userinfo()
            .then(
              () => {
                console.log("######## get_userinfo() :: Success");
              }
            ).catch(
              err => {
                console.log("Get UserInfo Error");
              }

            );
        }
      ).catch(err => {
        this.createNotification('error', 'Please use correct username and password', '')
        return
      });

    
  };

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState(errors); 
    }
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
    if (this.props.isAuthenticated) {
      if (this.props.isAdmin) {
        return (
          <Redirect to='/frontend/admin/dashboard'/>
        );
      } else {
        return (
          <Redirect to='/frontend/user/dashboard'/>
        )
      }
    } else {
      let {errors} = this.state;
      return (
        <Container className="container_login">
          <Row>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
              <Form onSubmit={this.handleLogin}>
                <Card
                  hidden={this.state.cardHidden}
                  textCenter
                  title="Login"
                  content={
                    <div>
                      <FormGroup>
                        <FormLabel>User name</FormLabel>
                        <FormControl placeholder="Enter username" type="text" name="username"  onChange={this.handleChangeInput}/>
                        <FormFeedback className="text-danger">{errors.username}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Password</FormLabel>
                        <FormControl placeholder="Password" type="password" name="password" autoComplete="off"/>
                        <FormFeedback className="text-danger">{errors.password}</FormFeedback>
                      </FormGroup>
                    </div>
                  }
                  legend={
                    <FormGroup>
                      <Button variant="primary" fill wd type="submit">
                        Login
                      </Button>
                      <FormText className="text-dark">Don't you have an account? <Link to="/frontend/auth/register-page"> Register</Link></FormText>
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
}

const mapStateToProps = state => ({
  isAuthenticated: AuthHelper.isAuthenticated(),
  isAdmin: AuthHelper.isAdmin(),
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  get_userinfo: () => dispatch(getUserInfo()),
  // get_basic_data: () => dispatch(getBasicData()),
  get_sports_id: () => dispatch(getSportsId()),
});



export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
