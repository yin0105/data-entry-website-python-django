
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  FormLabel,
  FormText,
  FormControl,
  FormCheck,
} from "react-bootstrap";

// import TimeSelector from "views/Components/TimeSelector";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Select from 'react-select'
import { loadFromLocalStorage } from "redux/reducers/auth";
import { Link } from "react-router-dom"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'
import axios from 'axios'

class UpdateSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEveryday: false,
      isActive: true,
      collectionName: '',
      inputList: [],
      weekdays: [0, 0, 0, 0, 0, 0, 0],
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };
  weekdays_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  curCollection = loadFromLocalStorage("collection")

  componentDidMount() {  
    this.setState({isActive: this.curCollection.active})
    let list = []
    for (let i=0; i<this.curCollection.weekdays.length; i++) {
      list.push(this.curCollection.weekdays.substr(i,1))
    }
    this.setState({weekdays: list})
    this.setState({isEveryday: this.curCollection.weekdays=="1111111"})
    let timeList = []
    this.curCollection.time_ranges.split("::").map((x, i) => {
      let tmp = x.split("/")
      let obj = {start_time: tmp[0], due: tmp[1], range_start: tmp[2], range_end: tmp[3]}
      timeList.push(obj)
    })
    this.setState({inputList: timeList})
  }

  handleCollectionChange = (collection) => {
    this.setState({ collection });
  }

  handleActiveChange = e => {
    this.setState({ isActive: e.target.checked });
  };

  handleEverydayChange = e => {
    this.setState({ isEveryday: e.target.checked });
    let val = e.target.checked? 1: 0
    this.setState({weekdays: [val, val, val, val, val, val, val]});
  };

  handleAddNewField = () => {
    this.setState({inputList: [...this.state.inputList, { start_time: null, due: null, range_start: null, range_end: null }]});
  };

  handleRemoveField = index => {
    const list = [...this.state.inputList];
    list.splice(index, 1);
    this.setState({inputList: list});
  };

  handleTimeSelectorChange = (e, row_index, col_name) => {
    const list = [...this.state.inputList];
    list[row_index][col_name] = e.value;
    this.setState({inputList: list});
    console.log(this.state.inputList)
  };

  handleWeekdayChange = (e, i) => {
    const list = [...this.state.weekdays];
    list[i] = e.target.checked? 1: 0;
    this.setState({weekdays: list});
    console.log(this.state.weekdays)
  };

  handleSave = () => {
    const weekdays = [...this.state.weekdays];
    if (weekdays.join("") == "0000000") {
      this.createNotification('error', 'Weekdays are missing!', 'Please select weekdays.')
      return
    }

    const inputList = [...this.state.inputList];
    
    if (inputList.length == 0) {
      this.createNotification('error', 'Time is missing!', 'Please add time to schedule.')
      return
    }

    let time_ranges = []
    inputList.map((x, i) => {
      if (x.start_time == null) {
        this.createNotification('error', 'Time is missing!', 'Please select start_time on line ' + String(i + 1))
        time_ranges = []
        return
      }
      if (x.due == null) {
        this.createNotification('error', 'Time is missing!', 'Please select due on line ' + String(i + 1))
        time_ranges = []
        return
      }
      if (x.range_start == null) {
        this.createNotification('error', 'Time is missing!', 'Please select range_start on line ' + String(i + 1))
        time_ranges = []
        return
      }
      if (x.range_end == null) {
        this.createNotification('error', 'Time is missing!', 'Please select range_end on line ' + String(i + 1))
        time_ranges = []
        return
      }
      time_ranges.push(x.start_time + "/" + x.due + "/" + x.range_start + "/" + x.range_end)
    })
    if (time_ranges.length == 0) return
    let form_data = new FormData();
    form_data.append('id', this.curCollection.id);
    form_data.append('collection', this.curCollection.collection);
    form_data.append('active', this.state.isActive? 1: 0);
    form_data.append('weekdays', weekdays.join(""));
    form_data.append('time_ranges', time_ranges.join("::"));
    let url = '/api/data_entry/schedule/';
    axios.put(url, form_data, {
        headers: {
            'Authorization': 'token ' + this.token,
        }
    }).then(res => {
      console.log("res = ", res[0])
        this.createNotification('success', 'Schedule has been updated successfully!', '')
        return
    }).catch(err => {console.log("Error"); console.log(err)})
  };

  TimeSelector = props => {
    let { row_index, col_name } = props
    const val_list = [...this.state.inputList];
    let list = []
    list.push({value: '', label:'None'})
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j++) {
            const tt = ("0"+ String(i)).substr(-2) + ":" + ("0"+ String(j)).substr(-2)
            list.push({value: tt, label: tt})
        }
    }
    return (
      <div className="time_selector">
          <Container fluid>
              <Row>
                  <Select options={list} value={list.filter(option => option.value === this.state.inputList[row_index][col_name])} onChange={e => this.handleTimeSelectorChange(e, row_index, col_name)}/>
              </Row>
          </Container>
      </div>
    );
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
    const { collection, isActive } = this.state;

    return (
      <div className="main-content">
        <Container fluid>
            <div className="d-flex">
                <FormLabel className="mx-auto h1 "><b>Edit Schedule</b></FormLabel>
            </div>
            <Row className="align-items-center mb-4">
                <Col md={{ span: 2, offset: 2 }} sm={{ span: 5 }} className="text-right">
                  <FormLabel>Collection : </FormLabel>
                </Col>
                <Col md={{ span: 5 }} sm={{ span: 7 }}>
                  <FormLabel>{this.curCollection.collection_name}</FormLabel>
                </Col>
            </Row>            
            <Row>
                <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }}>
                    <FormCheck inline label="Active" type="checkbox" checked={isActive} onChange={e => this.handleActiveChange(e)}/>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }}>
                    <FormCheck inline label="Run Everyday" checked={this.state.isEveryday} type="checkbox" onChange={e => this.handleEverydayChange(e)}/>
                </Col>
            </Row>
            {
              !(this.state.isEveryday) &&
              <Row className="d-flex">
                  <Row className="mx-auto">
                      <FormText>Select Weekdays : </FormText>
                      {this.weekdays_names.map((x, i) => {
                        return <FormCheck inline label={x} checked={this.state.weekdays[i]==1?true:false} type="checkbox" onClick={e => this.handleWeekdayChange(e, i)}/>
                      })}
                  </Row>
              </Row>
            }

            <Row>
                <Col md={{ span: 12 }} sm={{ span: 12 }}>
                    <Button variant="info" className="btn-fill" onClick={() => this.handleAddNewField()}>Add to Schedule</Button>
                </Col>
            </Row>
            <Row className="schedule_table">
              <Card
                w_100
                content={
                    <div >
                      {this.state.inputList.map((x, i) => {
                        console.log("x.start_time = ", x.start_time)
                        return (
                          <Row className="align-items-center">
                            <Col md={{ span: 11}}>
                              <Row  className="evenly_space">
                                <FormLabel>Start Time : </FormLabel>
                                <this.TimeSelector row_index={i} col_name="start_time"/>
                                <FormLabel>Due : </FormLabel>
                                <this.TimeSelector row_index={i} col_name="due"/>
                                <FormLabel>Range Start : </FormLabel>
                                <this.TimeSelector row_index={i} col_name="range_start"/>
                                <FormLabel>Range End : </FormLabel>
                                <this.TimeSelector row_index={i} col_name="range_end"/>
                              </Row>
                            </Col>
                              
                            <Col md={{ span: 1 }} className="justify-content-center d-flex">
                                <Button variant="info" className="btn-fill" onClick={() => this.handleRemoveField(i)}>Remove</Button>
                            </Col>
                          </Row>
                        )
                      })}
                    </div>
                  }
                  legend={
                      <Row>
                          <Col md={{ span: 2, offset: 4 }} className="d-flex justify-content-center">
                            <Link to="/frontend/admin/schedule_list" className="mx-auto btn btn-warning btn-fill">Cancel</Link>
                          </Col>
                          <Col md={{ span: 2}} className="d-flex justify-content-center">
                              <Button variant="primary" className="btn-fill" onClick={() => this.handleSave()}>Save</Button>
                          </Col>
                      </Row>
                  }
              />
            </Row>
            <NotificationContainer/>
        </Container>
      </div>
    );
  }
}

export default UpdateSchedule;
