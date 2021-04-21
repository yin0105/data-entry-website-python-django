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

class CollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range_start: '',
      range_end: '',
      redirect: null,
    }
  };

  token = loadFromLocalStorage("token");
  collection = loadFromLocalStorage("collection")
  
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  componentDidMount() {    
    const times = this.collection.time_ranges.split("/")
    this.setState({range_start: times[2]})
    this.setState({range_end: times[3]})
  }

  
  render() {
    return (
      <div className="main-content">
        <Container fluid>
            <div className="d-flex">
                <FormLabel className="mx-auto h1 "><b>Collection Page</b></FormLabel>
            </div>
            <Row className="align-items-baseline">
                <Col md={{ span: 2, offset: 1 }}>
                    <FormLabel>Collecting <b className="mx-4">{this.collection.name}</b></FormLabel>
                </Col>
                <Col md={{ span: 1 }}>
                    <FormLabel>{this.state.range_start} - {this.state.range_end}</FormLabel>
                </Col>
                <Col md={{ span: 3 }}>
                    <FormControl type="text"/>
                </Col>
                <Col md={{ span: 1 }}>
                    <Button variant="info" className="btn-fill">Search</Button>
                </Col>
                <Col md={{ span: 1 }}>
                    <Button variant="info" className="btn-fill">Show All</Button>
                </Col>
                <Col md={{ span: 2 }}>
                    <Button variant="info" className="btn-fill">Refresh API Data</Button>
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
                                        <th>pick</th>
                                        <th>grade</th>
                                        <th>line</th>
                                        <th>analyst</th>
                                        <th>Action</th>                        
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><FormCheck type="checkbox"/></td>
                                        <td><FormText>13:10</FormText></td>
                                        <td><FormText>Atlanta Hawks</FormText></td>
                                        <td><FormText>Miami Heat</FormText></td>
                                        <td><FormText>NBA</FormText></td>
                                        <td><FormControl type="text" value="Atlanta Hawks" /></td>
                                        <td><FormControl type="text" value="A" /></td>
                                        <td><FormControl type="text" value="-7.5" /></td>
                                        <td><FormControl type="text" value="Ralph Nugent" /></td>
                                        <td><Button variant="info" className="btn-fill">Duplicate</Button></td>
                                    </tr>

                                    <tr>
                                        <td><FormCheck type="checkbox"/></td>
                                        <td><FormText>13:10</FormText></td>
                                        <td><FormText>Atlanta Hawks</FormText></td>
                                        <td><FormText>Miami Heat</FormText></td>
                                        <td><FormText>NBA</FormText></td>
                                        <td><FormControl type="text" value="Atlanta Hawks" /></td>
                                        <td><FormControl type="text" value="A" /></td>
                                        <td><FormControl type="text" value="-7.5" /></td>
                                        <td><FormControl type="text" value="Ralph Nugent" /></td>
                                        <td><Button variant="info" className="btn-fill">Duplicate</Button></td>
                                    </tr>

                                    <tr>
                                        <td><FormCheck type="checkbox"/></td>
                                        <td><FormText>13:10</FormText></td>
                                        <td><FormText>Atlanta Hawks</FormText></td> 
                                        <td><FormText>Miami Heat</FormText></td>
                                        <td><FormText>NBA</FormText></td>
                                        <td><FormControl type="text" value="Atlanta Hawks" /></td>
                                        <td><FormControl type="text" value="A" /></td>
                                        <td><FormControl type="text" value="-7.5" /></td>
                                        <td><FormControl type="text" value="Ralph Nugent" /></td>
                                        <td><Button variant="info" className="btn-fill">Duplicate</Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        }
                        legend={
                            <Row>
                                <Col md={{ span: 2, offset: 4 }} className="d-flex justify-content-center">
                                    <Button variant="warning" className="btn-fill">Cancel</Button>
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
