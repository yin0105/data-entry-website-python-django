
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  OverlayTrigger,
  Tooltip,
  FormLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom"
// react component that creates a switch button that changes from on to off mode
import Switch from "react-bootstrap-switch";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios'
import { loadFromLocalStorage, saveToLocalStorage } from "redux/reducers/auth";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'
import {Redirect} from 'react-router-dom';
import Select from 'react-select'


class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      redirect: null,
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  roles = [
    {label: 'admin', value: 'admin'},
    {label: 'data_collector', value: 'data_collector'},
  ]

  componentDidMount() {    
    axios.get('/api/accounts/users/', {'headers': this.headers})
      .then(res => {
        console.log("res = ", res)
        this.setState({ users: res.data });
        console.log("users = ", this.state.users)
      });
  }

  handleActiveChange = index => {
    const list = [...this.state.users];
    list[index]["is_active"] = !list[index]["is_active"];
    this.setState({users: list});

    let form_data = new FormData();
    form_data.append('id', list[index]["id"]);
    form_data.append('is_active', list[index]["is_active"]);
    let url = '/api/accounts/users/' + list[index]["id"] + '/';
    axios.put(url, form_data, {
      headers: {
          'Authorization': 'token ' + this.token,
      }
    }).then(res => {
      this.createNotification('success', 'User information has been updated successfully!', '')
      return
    }).catch(err => {console.log("Error"); console.log(err)})
  }

  // handleRoleChange = (e, index) => {
  //   console.log("########## handleRoleChange ()")
  //   console.log("users = ", this.state.users)

  //   const list = [...this.state.users]
  //   // let list = [...this.state.events]
  //   // console.log(list)
  //   console.log("list = ", list)
  //   // list[index]["role"] = e.value;
  //   // this.setState({users: list});

  //   console.log("e.value = ", e.value)
  //   // let form_data = new FormData();
  //   // form_data.append('id', u_id);
  //   // form_data.append('role', e.value);
  //   // let url = '/api/accounts/users/' + u_id + '/';
  //   // console.log("token = ", this.token)
  //   // axios.put(url, form_data, {
  //   //   headers: {
  //   //       'Authorization': 'token ' + this.token,
  //   //   }
  //   // }).then(res => {
  //   //   console.log("res = ", res)
  //   //   this.createNotification('success', 'User information has been updated successfully!', '')
  //   //   return
  //   // }).catch(err => {console.log("Error"); console.log(err)})
  // };

  handleRoleChange = (e, index) => {
    // const { users } = this.state;
    // console.log("users =>", this.state.users);
    // console.log("1")
    let list = [... this.state.users];
    console.log("list => ", list)

    list[index]["role"] = e.value;
    this.setState({users: list});

    console.log("e.value = ", e.value)
    let form_data = new FormData();
    form_data.append('id', this.state.users[index].id);
    form_data.append('role', e.value);
    let url = '/api/accounts/users/' + this.state.users[index].id + '/';
    console.log("token = ", this.token)
    axios.put(url, form_data, {
      headers: {
          'Authorization': 'token ' + this.token,
      }
    }).then(res => {
      console.log("res = ", res)
      this.createNotification('success', 'User information has been updated successfully!', '')
      return
    }).catch(err => {console.log("Error"); console.log(err)})
  }

  handleRemoveClick = (user_id) => {
    confirmAlert({
      title: 'Confirm to remove',
      message: 'Are you sure to remove this user.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => axios.delete('/api/accounts/users/' + user_id + '/', {'headers': this.headers})
            .then(res => {              
              axios.get('/api/accounts/users/', {'headers': this.headers})
                .then(res => {
                  this.setState({ users: res.data });
                  this.createNotification('success', 'Remove Schedule', 'Selected shedule has been removed successfully!')
                  return
                }).catch(err => {console.log("Error"); console.log(err)})
            }).catch(err => {console.log("Error"); console.log(err)})
            
        },
        {
          label: 'No',
        }
      ]
    });
  }

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
    const edit = <Tooltip id="edit">Edit Schedule</Tooltip>;
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    const actions = (
      <td className="td-actions">
        <OverlayTrigger placement="top" overlay={edit}>
          <Button simple bsStyle="success" bsSize="xs">
            <i className="fa fa-edit" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={remove}>
          <Button simple bsStyle="danger" bsSize="xs">
            <i className="fa fa-times" />
          </Button>
        </OverlayTrigger>
      </td>
    );
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>User List</b></FormLabel>
          </div>
          <Row>
            <Col md={{ span: 10, offset: 1 }} sm={{ span: 12 }}>
              <Card
                tableFullWidth
                textCenter
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>role</th>
                        <th>Active</th>
                        <th>Action</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.users.map((u,i) => {
                          console.log("user role = ", u.role);
                          console.log("user active = ", u.is_active);
                          return (<tr>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>
                              {/* <Select options={this.roles} value={u.role} onChange={this.handleRoleChange}/> */}
                              <Select options={this.roles} value={this.roles.filter(option => option.value === u.role)} onChange={e => this.handleRoleChange(e, i)}/>
                            </td>
                            <td>
                              <Switch onText="" offText="" defaultValue={u.is_active} onChange={() => this.handleActiveChange(i)}/>
                            </td>
                            <td className="td-actions">
                              <OverlayTrigger placement="top" overlay={remove}>
                                <Button simple bsStyle="danger" bsSize="xs" onClick={() => this.handleRemoveClick(u.id)}>
                                  <i className="fa fa-times" />
                                </Button>
                              </OverlayTrigger>
                            </td>
                            
                          </tr>);
                        })}
                    </tbody>
                  </Table>
                }
                legend={
                  <div class="d-flex">
                    <Link to="/frontend/admin/add_schedule" className="mx-auto btn btn-primary btn-fill">
                      Add Schedule
                    </Link>
                  </div>
                }
              />
            </Col>
          </Row>
          <NotificationContainer/>
        </Container>
      </div>
    );
  }
}

export default UserList;
