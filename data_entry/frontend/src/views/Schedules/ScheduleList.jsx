
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
import { loadFromLocalStorage } from "redux/reducers/auth";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'


class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  componentDidMount() {    
    axios.get('/api/data_entry/schedule/', {'headers': this.headers})
      .then(res => {
        console.log("res = ", res)
        this.setState({ schedules: res.data });
        console.log("schedules = ", this.state.schedules)
      });
  }

  handleActiveChange = x => {
    console.log("handleActiveChange", x)
    let form_data = new FormData();
    form_data.append('id', x.id);
    form_data.append('collection', x.collection);
    form_data.append('active', !(x.active));
    form_data.append('weekdays', x.weekdays);
    form_data.append('time_ranges', x.time_ranges);
    let url = '/api/data_entry/schedule/';
    axios.put(url, form_data, {
        headers: {
            'Authorization': 'token ' + this.token,
        }
    }).then(res => {
      console.log("res = ", res)
        this.createNotification('success', 'Schedule has been updated successfully!', '')
        return
    }).catch(err => {console.log("Error"); console.log(err)})
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
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>Schedule List</b></FormLabel>
          </div>
          <Row>
            <Col md={{ span: 8, offset: 2 }} sm={{ span: 12 }}>
              <Card
                tableFullWidth
                textCenter
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Collection Name</th>
                        <th>Start Time</th>
                        <th>Due</th>
                        <th>Collect</th>
                        <th>Action</th>                        
                        <th>Active</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.schedules.map((x,i) => {
                          let times = x.time_ranges.split("/")
                          console.log("x.active = ", x.active)
                          return (<tr>
                            <td>{x.collection_name}</td>
                            <td>{times[0]}</td>
                            <td>{times[1]}</td>
                            <td>{times[2]} - {times[3]}</td>
                            {actions}
                            <td>
                              <Switch onText="" offText="" defaultValue={x.active} onChange={() => this.handleActiveChange(x)} />
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

export default ScheduleList;
