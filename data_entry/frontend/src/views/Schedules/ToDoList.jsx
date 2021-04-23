
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


class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      filteredSchedules: [],
      redirect: null,
    }
  };

  token = loadFromLocalStorage("token");
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
    let weekday = d.getUTCDay();
    weekday = weekday == 0? 7: weekday
    const timer = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds()
    let filteredSchedules = []
    this.state.schedules.map((schedule) => {
      let isDisplay = false
      let selectedTimeRange = ""
      schedule.status == 'available' && schedule.active && schedule.weekdays[weekday - 1] == "1" && schedule.time_ranges.split("::").map((time_range) => {
        if (isDisplay) return
        const start_time = time_range.split("/")[0]
        let start_timer = 0
        if (start_time != "") {
          const hour_min = start_time.split(":")
          start_timer = parseInt(hour_min[0], 10) * 3600 + (parseInt(hour_min[1], 10) - 2) * 60
        }

        const due = time_range.split("/")[1]
        let due_timer = 86400
        if (due != "") {
          const hour_min = due.split(":")
          due_timer = parseInt(hour_min[0], 10) * 3600 + parseInt(hour_min[1], 10) * 60
        }
        if (timer >= start_timer && timer <= due_timer) {
          isDisplay = true
          selectedTimeRange = time_range
          return
        }
      })
      if (isDisplay) {
        let tmpSchedule = {...schedule}
        tmpSchedule.time_ranges = selectedTimeRange
        filteredSchedules.push(tmpSchedule)
      }
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

  gotoCollect = async(xx) => {
    console.log("gotoCollect()")
    let ok = false
    let form_data = new FormData();
    let url = '/api/data_entry/schedule/';
    this.state.schedules.map((x) => {
      if (ok) return
      if (x.id == xx.id) {
        form_data.append('id', x.id);
        form_data.append('collection', x.collection);
        form_data.append('active', x.active);
        form_data.append('weekdays', x.weekdays);
        form_data.append('time_ranges', x.time_ranges);
        form_data.append('status', 'in_progress');
        ok = true
        return
      }
    })
    if (ok) {
      await axios.put(url, form_data, {
        headers: {
            'Authorization': 'token ' + this.token,
        }
      }).then(async (res) => {
        console.log("res = ", res)
        await axios.get('/api/data_entry/collection/?name=' + xx.collection_name, {headers: this.headers})
        .then(res => {
          let collectionToRedirect = { ...res.data[0], time_ranges: xx.time_ranges }
          saveToLocalStorage("collection", collectionToRedirect)
          this.setState({redirect: "/frontend/user/collection_page"})
        });
      }).catch(err => {console.log("Error"); console.log(err)})
    }
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
                            <td>
                            {/* <Link to="/frontend/user/colletion_page" className="mx-auto btn btn-success btn-fill"> */}
                            <Button variant="success" fill wd mx_auto type="submit" onClick={() => this.gotoCollect(x)}>
                              Collect
                            </Button>
                            {/* </Link> */}
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

export default ToDoList;
