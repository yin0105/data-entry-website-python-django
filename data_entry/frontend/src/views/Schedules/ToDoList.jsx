
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
import { xt256 } from "react-syntax-highlighter/dist/styles/hljs";


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
    console.log("Offset = ", process.env.OFFSET); 
  }

  getSchedules = () => {
    axios.get('/api/data_entry/schedule/', {'headers': this.headers})
      .then(res => {
        this.setState({ schedules: res.data });
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
      schedule.active && schedule.weekdays[weekday - 1] == "1" && schedule.time_ranges.split("::").map((time_range, sub_sch_index) => {
        let sub_status = schedule.status.split("/")[sub_sch_index]
        if (sub_status == 'available' || sub_status.indexOf(this.user.id + "::") == 0) {
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
          // if (timer >= start_timer && timer <= due_timer) {
          if (timer < start_timer) {
            sub_status = "none"
          }
          let tmpSchedule = {...schedule}
          tmpSchedule.time_ranges = time_range
          tmpSchedule.status = sub_status
          tmpSchedule.index = sub_sch_index
          filteredSchedules.push(tmpSchedule)
        }
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

  gotoCollect = async(x) => {
    let form_data = new FormData();
    let url = '/api/data_entry/schedule/';
    let status = ''
    form_data.append('id', x.id);
    form_data.append('index', x.index);
    if (x.status == "available") {
      form_data.append('status', 'in_progress');
      status = 'in_progress'
    } else {
      form_data.append('status', x.status)
      status = x.status
    }
    await axios.put(url, form_data, {
      headers: {
          'Authorization': 'token ' + this.token,
      }
    }).then(async (res) => {
      await axios.get('/api/data_entry/collection/?name=' + x.collection_name, {headers: this.headers})
      .then(res => {
        let collectionToRedirect = { ...res.data[0], time_ranges: x.time_ranges, status: status, sch_id: x.id, index: x.index }
        saveToLocalStorage("collection", collectionToRedirect)
        this.setState({redirect: "/frontend/user/collection_page"})
      });
    }).catch(err => {console.log("Error"); console.log(err)})
  }

  convertToLocalTime = t => {
    if (t == "") return ""
    let h = parseInt(t.split(":")[0])
    let m = parseInt(t.split(":")[1])
    const totalMin = h * 60 + m - new Date().getTimezoneOffset()
    h = parseInt(totalMin / 60) % 24
    m = totalMin % 60
    return ("0".concat(h.toString())).substr(-2) + ":" + ("0".concat(m.toString())).substr(-2)
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>Collections To Do</b></FormLabel>
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
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.filteredSchedules.map((x,i) => {
                          let start_time = '', due = '', collect = ''
                          let times = x.time_ranges.split("/")
                          start_time = times[0]
                          due = times[1]
                          collect += times[2] + ' - ' + times[3]
                          return (<tr>
                            <td>{x.collection_name}</td>
                            <td>{start_time}</td>
                            <td>{due}</td>
                            <td>{collect}</td>
                            {/* <td dangerouslySetInnerHTML={{__html: start_time}} />
                            <td dangerouslySetInnerHTML={{__html: due}} />
                            <td dangerouslySetInnerHTML={{__html: collect}} />                             */}
                            <td>
                            { x.status == "available" && <Button variant="success" fill wd mx_auto type="submit" onClick={() => this.gotoCollect(x)}>
                              Collect
                            </Button>}
                            { x.status != "none" && x.status != "available" && <Button variant="warning" fill wd mx_auto type="submit" onClick={() => this.gotoCollect(x)}>
                              Re-Run
                            </Button>} 
                            { x.status == "none" && <span style={{ color: 'blue' }}>Upcoming ...</span>}                           
                            </td>
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
