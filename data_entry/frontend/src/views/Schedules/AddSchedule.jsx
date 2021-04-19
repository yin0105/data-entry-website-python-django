
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
        collections: [],
        collection: null,
        // collectionName: '',
        inputList: [],
        weekdays: [0, 0, 0, 0, 0, 0, 0],
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };

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
    this.setState({ collection });
  }

  handleEverydayChange = e => {
    console.log("e.target.checked = ", e.target.checked)
    this.setState({ isEveryday: e.target.checked });
    console.log("isEveryday: ", this.state.isEveryday)
  };

  handleAddNewField = () => {
    this.setState({inputList: [...this.state.inputList, { start_time: null, due: null, range_start: null, range_end: null }]});
    console.log("inputList =>", this.state.inputList)
  };

  handleRemoveField = index => {
    const list = [...this.state.inputList];
    list.splice(index, 1);
    this.setState({inputList: list});
  };

  handleTimeSelectorChange = (e, row_index, col_name) => {
    console.log("e = ",e, row_index, col_name )
    const list = [...this.state.inputList];
    list[row_index][col_name] = e.value;
    this.setState({inputList: list});
    console.log(this.state.inputList)
  };

  handleSave = () => {

    // if (this.state.collectionName == "") {
    //     this.createNotification('error', 'Collection name is missing!', 'Please enter collection name.')
    //     return
    // }
    // const list = [...this.state.inputList];
    // let isEmpty = false;
    // let field_names = [], field_types = []

    // list.map((x, i) => {
    //     if (x.fieldName == "") {
    //         isEmpty = true;
    //         return
    //     }
    //     field_names.push(x.fieldName)
    //     field_types.push(x.fieldType)
    // })
    // if (isEmpty) {
    //     this.createNotification('error', 'Field Name is missing!', 'Please enter field name.')
    //     return
    // }
    // let sports_list = []
    // this.state.sports.map((x) => {
    //     if (x > 0) {sports_list.push(x)}
    // })
    // console.log("sports_list = ", sports_list)
    
    // // Add Collection
    // let form_data = new FormData();

    // form_data.append('name', this.state.collectionName);
    // form_data.append('sports', sports_list.join("::"));
    // form_data.append('field_names', field_names.join("::"));
    // form_data.append('field_types', field_types.join("::"));
    // let url = '/api/data_entry/collection/';
    // axios.post(url, form_data, {
    //     headers: {
    //         'Authorization': 'token ' + this.token,
    //     }
    // }).then(res => {
    //     this.createNotification('success', 'New collection has been added successfully!', '')
    //     return
    // }).catch(err => console.log(err))
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

  render() {
    const { collection } = this.state;

    return (
      <div className="main-content">
        <Container fluid>
            <div className="d-flex">
                <FormLabel className="mx-auto h1 "><b>Add Schedule</b></FormLabel>
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
                    <FormCheck inline label="Run Everyday" type="checkbox" onChange={e => this.handleEverydayChange(e)}/>
                </Col>
            </Row>
            {
              !(this.state.isEveryday) &&
              <Row className="d-flex">
                  <Row className="mx-auto">
                      <FormText>Select Weekdays : </FormText>
                      <FormCheck inline label="Monday" type="checkbox"/>
                      <FormCheck inline label="Tuesday" type="checkbox"/>
                      <FormCheck inline label="Wendesday" type="checkbox"/>
                      <FormCheck inline label="Thirsday" type="checkbox"/>
                      <FormCheck inline label="Friday" type="checkbox"/>
                      <FormCheck inline label="Saturday" type="checkbox"/>
                      <FormCheck inline label="Sunday" type="checkbox"/>
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
                              <Row>
                                <Col md={{ span: 3 }} className="text-right">
                                  <Row className="align-items-baseline my-0">
                                    <FormLabel>Start Time : </FormLabel>
                                    <this.TimeSelector row_index={i} col_name="start_time"/>
                                  </Row>
                                </Col>

                                <Col md={{ span: 3 }} className="text-right">
                                  <Row className="align-items-baseline my-0">
                                    <FormLabel>Due : </FormLabel>
                                    <this.TimeSelector row_index={i} col_name="due"/>
                                  </Row>
                                </Col>

                                <Col md={{ span: 3 }} className="text-right">
                                  <Row className="align-items-baseline my-0">
                                    <FormLabel>Range Start : </FormLabel>
                                    <this.TimeSelector row_index={i} col_name="range_start"/>
                                  </Row>
                                </Col>

                                <Col md={{ span: 3 }} className="text-right">
                                  <Row className="align-items-baseline">
                                    <FormLabel>Range End : </FormLabel>
                                    <this.TimeSelector row_index={i} col_name="range_end"/>
                                  </Row>
                                </Col>
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
        </Container>
      </div>
    );
  }
}

export default AddCollection;
