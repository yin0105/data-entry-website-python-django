/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  OverlayTrigger,
  Tooltip,
  FormGroup,
  FormLabel,
  FormText,
  FormControl,
  Radio,
  FormCheck,
} from "react-bootstrap";
import { Link } from "react-router-dom"
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios'
import { loadFromLocalStorage, saveToLocalStorage } from "redux/reducers/auth";
import Select from 'react-select'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'
import {Redirect} from 'react-router-dom';

class CollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range_start: '',
      range_end: '',
      field_names: [],
      field_types: [],
      events: [],
      redirect: null,
      isSearch: false,
      searchString: '',
      tmpSearchString: '',
    }
  };

  token = loadFromLocalStorage("token");
  collection = loadFromLocalStorage("collection")
  sports_ids = loadFromLocalStorage("sports_ids");
  
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  componentDidMount() {    
    const times = this.collection.time_ranges.split("/")
    this.setState({range_start: times[2]})
    this.setState({range_end: times[3]})
    this.setState({field_names: this.collection.field_names.split("::")})
    this.setState({field_types: this.collection.field_types.split("::")})
    this.getEvents(false)
  }

  getEvents = force => {
    let list = []
    this.setState({events: list})
    const d = new Date();
    let today = String(d.getUTCFullYear()) + "-" + String(d.getUTCMonth() + 1) + "-" + String(d.getUTCDate())
    this.collection.sports.split("::").map((x) => {
      let s_name = null
      this.sports_ids.map((s) => {
        if (s_name != null) return
        console.log("sport_id, x = ", s.sport_id, x)
        if (s.sport_id == x) {
          s_name = s.sport_name
          return
        }
      })
      const url = '/api/data_entry/api_cache/?query=sports/' + x + '/events/' + today + (force? '&force=1':'')
      let fields = []
      this.collection.field_types.split("::").map((x, i) => {
        fields.push({type: x, value: ''})
      })
      console.log("fields = ", fields)
      axios.get(url, {'headers': this.headers})
        .then(res => {
          const resData = JSON.parse(res.data[0].data)
          resData.events.map(e => {
            let eventDate = e.event_date.substr(11, 5)
            if (this.state.range_start != "" && eventDate < this.state.range_start) return
            if (this.state.range_end != "" && eventDate > this.state.range_end) return
            let eventRow = {
              eventId: e.event_id,
              sportId: e.sport_id,
              sportName: s_name,
              home: e.teams_normalized[0].is_home == true? {
                teamId: e.teams_normalized[0].team_id,
                name: e.teams_normalized[0].name,
                mascot: e.teams_normalized[0].mascot,
                fullName: e.teams_normalized[0].name + " " + e.teams_normalized[0].mascot,
              } : {
                teamId: e.teams_normalized[1].team_id,
                name: e.teams_normalized[1].name,
                mascot: e.teams_normalized[1].mascot,
                fullName: e.teams_normalized[1].name + " " + e.teams_normalized[1].mascot,
              },
              away: e.teams_normalized[0].is_away == true? {
                teamId: e.teams_normalized[0].team_id,
                name: e.teams_normalized[0].name,
                mascot: e.teams_normalized[0].mascot,
                fullName: e.teams_normalized[0].name + " " + e.teams_normalized[0].mascot,
              } : {
                teamId: e.teams_normalized[1].team_id,
                name: e.teams_normalized[1].name,
                mascot: e.teams_normalized[1].mascot,
                fullName: e.teams_normalized[1].name + " " + e.teams_normalized[1].mascot,
              },
              gameTime: eventDate,
              fields: fields,
            }
            list.push(eventRow)
          })
          this.setState({events: list})
          // console.log("events = ", this.state.events)
        });
    })
  }

  handleDupliacte = index => {
    let list = [...this.state.events]
    list = list.slice(0, index + 1).concat(list.slice(index, index + 1)).concat(list.slice(index + 1))
    this.setState({events: list})
  }

  handleSearchStringChange = e => {
    this.setState({tmpSearchString: e.target.value})
  }

  handleSearchClick = () => {
    this.setState({searchString: this.state.tmpSearchString})
    this.setState({isSearch: true})
  }

  handleShowAll = () => {
    this.setState({isSearch: false})
  }

  
  render() {
    return (
      <div className="main-content">
        <Container fluid>
            <div className="d-flex">
                <FormLabel className="mx-auto h1 "><b>Collection Page</b></FormLabel>
            </div>
            <Row className="align-items-baseline">
                <Col md={{ span: 4, offset: 1 }}>
                    <FormLabel>Collecting <b className="mx-4">{this.collection.name}</b></FormLabel>
                    <FormLabel>{this.state.range_start} - {this.state.range_end}</FormLabel>
                </Col>
                <Col md={{ span: 2 }}>
                    <FormControl type="text" onChange={e => this.handleSearchStringChange(e)}/>
                </Col>
                <Col md={{ span: 4 }} style={{ display: 'flex', justifyContent: 'space-around'}}>
                    <Button variant="info" className="btn-fill" onClick={() => this.handleSearchClick()}>Search</Button>
                    <Button variant="info" className="btn-fill" onClick={() => this.handleShowAll()}>Show All</Button>
                    <Button variant="info" className="btn-fill" onClick={() => this.getEvents(true)}>Refresh API Data</Button>
                </Col>
            </Row>

            <Row>
                <Col md={{ span: 10, offset:1 }} sm={{ span: 12 }}>
                    <Card
                        content={
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>No pick?</th>                        
                                        <th>Game time</th>
                                        <th>Home</th>
                                        <th>Away</th>
                                        <th>sport</th>
                                        {this.state.field_names.map((x) => {return (<th>{x}</th>)})}
                                        <th>Action</th>                        
                                    </tr>
                                </thead>
                                <tbody>
                                  { this.state.events.map((e, i) => {
                                    let found = false
                                    const searchString = this.state.searchString.toLowerCase()
                                    if (this.state.isSearch && searchString != '') {
                                      if (e.gameTime.toLowerCase().includes(searchString)) {
                                        found = true
                                      } else if (e.home.fullName.toLowerCase().includes(searchString)) {
                                        found = true
                                      } else if (e.away.fullName.toLowerCase().includes(searchString)) {
                                        found = true
                                      } else if (e.sportName.toLowerCase().includes(searchString)) {
                                        found = true
                                      } else {
                                        e.fields.map((x) => {
                                          if (x.value.toLowerCase().includes(searchString)) {
                                            found = true
                                          }
                                        })
                                      }
                                      if (!found) return
                                    }
                                    return (
                                      <tr>
                                        <td><FormCheck type="checkbox"/></td>
                                        <td><FormText>{e.gameTime}</FormText></td>
                                        <td><FormText>{e.home.fullName}</FormText></td>
                                        <td><FormText>{e.away.fullName}</FormText></td>
                                        <td><FormText>{e.sportName}</FormText></td>
                                        {e.fields.map((x) => {
                                          if (x.type == 'teamname') {
                                            return <td style={{ minWidth: 150 }}><Select options={[{value: e.home.fullName, label: e.home.fullName}, {value: e.away.fullName, label: e.away.fullName}]} /></td>
                                          } else {
                                            return <td><FormControl type="text" placeholder={x.type} /></td>
                                          }
                                        })}
                                        <td><Button variant="info" className="btn-fill" onClick={() => this.handleDupliacte(i)}>Duplicate</Button></td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                            </Table>
                        }
                        legend={
                            <Row>
                                <Col md={{ span: 2, offset: 4 }} className="d-flex justify-content-center">
                                  <Link to="/frontend/user/dashboard" className="mx-auto btn btn-primary btn-fill">
                                    Cancel
                                  </Link>
                                </Col>
                                <Col md={{ span: 2}} className="d-flex justify-content-center">
                                    <Button variant="primary" className="btn-fill">Submit</Button>
                                </Col>
                            </Row>
                        }
                    />
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default CollectionPage;
