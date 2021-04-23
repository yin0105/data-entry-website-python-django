
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

class AddCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEveryday: false,
      isActive: true,
      collections: [],
      collection: null,
      collection_id: null,
      // collectionName: '',
      inputList: [],
      weekdays: [0, 0, 0, 0, 0, 0, 0],
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };
  weekdays_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  componentDidMount() {    
    axios.get('/api/data_entry/collection/', {'headers': this.headers})
      .then(res => {
        this.setState({ collections: res.data.map(d => ({
          "value" : d.id,
          "label" : d.name
        }))});
      })
  }

  handleCollectionChange = (collection) => {
    axios.get('/api/data_entry/schedule/', {'headers': this.headers})
      .then(res => {
        let scheduled = false
        res.data.map(row => {
          if (scheduled) return
          if (row.id == collection.value) {
            scheduled = true
            return
          }
        })
        if (scheduled) {
          this.createNotification('error', '', 'Already exists. Please edit the schedule from the schedule admin page.')
          return
        } else {
          this.setState({ collection });
        }
      })
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

    if (this.state.collection == null) {
      this.createNotification('error', 'Collection name is missing!', 'Please select collection name.')
      return
    }

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
    // let isEmpty = false;
    // let field_names = [], field_types = []

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
    console.log("this.state.collection = ", this.state.collection)
    form_data.append('collection', this.state.collection.value);
    form_data.append('active', this.state.isActive? 1: 0);
    form_data.append('weekdays', weekdays.join(""));
    form_data.append('time_ranges', time_ranges.join("::"));
    let url = '/api/data_entry/schedule/';
    axios.post(url, form_data, {
        headers: {
            'Authorization': 'token ' + this.token,
        }
    }).then(res => {
      console.log("res = ", res[0])
        this.createNotification('success', 'New schedule has been added successfully!', '')
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
                  <Select options={list} value={val_list[col_name]} onChange={e => this.handleTimeSelectorChange(e, row_index, col_name)}/>
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
                <FormLabel className="mx-auto h1 "><b>Create New Schedule</b></FormLabel>
            </div>
            <Row className="align-items-center mb-4">
                <Col md={{ span: 2, offset: 2 }} sm={{ span: 5 }} className="text-right">
                    <FormLabel>Collection : </FormLabel>
                </Col>
                <Col md={{ span: 5 }} sm={{ span: 7 }}>
                  <Select options={this.state.collections} value={collection} onChange={collection => this.handleCollectionChange(collection)}/>
                </Col>
            </Row>            
            <Row>
                <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }}>
                    <FormCheck inline label="Active" type="checkbox" checked={isActive} onChange={e => this.handleActiveChange(e)}/>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }}>
                    <FormCheck inline label="Run Everyday" type="checkbox" onChange={e => this.handleEverydayChange(e)}/>
                </Col>
            </Row>
            {
              !(this.state.isEveryday) &&
              <Row className="d-flex">
                  <Row className="mx-auto">
                      <FormText>Select Weekdays : </FormText>
                      {this.weekdays_names.map((x, i) => {
                        return <FormCheck inline label={x} type="checkbox" onClick={e => this.handleWeekdayChange(e, i)}/>
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
                              <Row className="evenly_space">
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

export default AddCollection;
