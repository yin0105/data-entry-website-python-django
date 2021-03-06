
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


class CollectionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      filteredSchedules: [],
      redirect: null,
    }
  };

  token = loadFromLocalStorage("token");
  user = loadFromLocalStorage("user");
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  componentDidMount() {    
    this.getSchedules()
  }

  getSchedules = () => {
    axios.get('/api/data_entry/schedule/', {'headers': this.headers})
      .then(res => {
        this.setState({ schedules: res.data });
        console.log("this.state.schedule = ", this.state.schedules)
        this.filterToDoList()
        var intervalId = setInterval(this.filterToDoList, 10000);
      });
  }

  filterToDoList = () => {
    const d = new Date();
    let weekday = d.getDay();
    weekday = weekday == 0? 7: weekday
    const timer = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
    let filteredSchedules = []
    this.state.schedules.map((schedule) => {
      // let isDisplay = false
      
      
      schedule.active && schedule.weekdays[weekday - 1] == "1" && schedule.time_ranges.split("::").map((time_range, sub_sch_index) => {
        let sub_status = schedule.status.split("/")[sub_sch_index]
        let completedTime = "-"
        if (sub_status == 'available') {
          const start_time = time_range.split("/")[0]
          let start_timer = 0
          if (start_time != "") {
            const hour_min = start_time.split(":")
            start_timer = parseInt(hour_min[0], 10) * 3600 + (parseInt(hour_min[1], 10) - 2) * 60
          }

          // const due = time_range.split("/")[1]
          // let due_timer = 86400
          // if (due != "") {
          //   const hour_min = due.split(":")
          //   due_timer = parseInt(hour_min[0], 10) * 3600 + parseInt(hour_min[1], 10) * 60
          // }
          if (timer < start_timer) { // && timer <= due_timer
            sub_status = "upcoming"
          }
        } else if (sub_status != "in_progress") {
          completedTime = sub_status.split("::")[1]
          sub_status = "completed"
        }

        let tmpSchedule = {...schedule}
        tmpSchedule.status = sub_status
        tmpSchedule.time_ranges = time_range
        tmpSchedule.completedTime = completedTime
        filteredSchedules.push(tmpSchedule)
      })
    })
    this.setState({filteredSchedules})
  }

  handleActiveChange = x => {
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
        this.createNotification('success', 'Schedule has been updated successfully!', '')
        return
    }).catch(err => {console.log("Error"); console.log(err)})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>Collections Status</b></FormLabel>
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
                        <th>Collection Name</th>
                        <th>Start Time</th>
                        <th>Due</th>
                        <th>Collect</th>
                        <th>Status</th>
                        <th>Completed Time</th>                       
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.filteredSchedules.map((x,i) => {
                          let start_time = '', due = '', collect = ''
                          x.time_ranges.split("::").map((row, j) => {
                            let times = row.split("/")
                            start_time += (start_time != ''? '<br>': '') + '<span>' + times[0] + '</span>'
                            due += (due != ''? '<br>': '') + '<span>' + times[1] + '</span>'
                            collect += (collect != ''? '<br>': '') + '<span>' + times[2] + ' - ' + times[3] + '</span>'
                          })
                          return (<tr>
                            <td>{x.collection_name}</td>
                            <td dangerouslySetInnerHTML={{__html: start_time}} />
                            <td dangerouslySetInnerHTML={{__html: due}} />
                            <td dangerouslySetInnerHTML={{__html: collect}} />
                            {x.status == 'completed' && <td className='text-success'>{x.status}</td>}
                            {x.status == 'in_progress' && <td className='text-danger'>{x.status}</td>}
                            {x.status == 'available' && <td className='text-primary'>{x.status}</td>}
                            {x.status == 'upcoming' && <td className='text-warning'>{x.status}</td>}
                            <td>{x.completedTime}</td>
                          </tr>);
                        })}
                    </tbody>
                  </Table>
                }
                legend={
                  <div class="d-flex">
                    <Button variant="primary" fill wd mx_auto type="submit" onClick={() => this.getSchedules()}>
                      Refresh
                    </Button>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default CollectionStatus;
