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

// react component that creates a switch button that changes from on to off mode
import Switch from "react-bootstrap-switch";

import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";

import img1 from "assets/img/blog-1.jpg";
import img2 from "assets/img/blog-2.jpg";
import img3 from "assets/img/blog-3.jpg";
import img4 from "assets/img/blog-4.jpg";
import img5 from "assets/img/blog-5.jpg";

class AddCollection extends Component {
  render() {
    const view = <Tooltip id="view">View Profile</Tooltip>;
    const edit = <Tooltip id="edit">Edit Profile</Tooltip>;
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    const viewPost = <Tooltip id="view">View Post</Tooltip>;
    const editPost = <Tooltip id="edit">Edit Post</Tooltip>;
    const removePost = <Tooltip id="remove">Remove Post</Tooltip>;
    const actions = (
      <td className="td-actions text-center">
        <OverlayTrigger placement="top" overlay={view}>
          <Button simple bsStyle="info" bsSize="xs">
            <i className="fa fa-user" />
          </Button>
        </OverlayTrigger>
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
    const actionsPost = (
      <td className="td-actions">
        <OverlayTrigger placement="left" overlay={viewPost}>
          <Button simple icon bsStyle="info">
            <i className="fa fa-image" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="left" overlay={editPost}>
          <Button simple icon bsStyle="success">
            <i className="fa fa-edit" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="left" overlay={removePost}>
          <Button simple icon bsStyle="danger">
            <i className="fa fa-times" />
          </Button>
        </OverlayTrigger>
      </td>
    );
    return (
      <div className="main-content">
        <Container fluid>
            <div className="d-flex">
                <FormLabel className="mx-auto h1 "><b>Add Collection</b></FormLabel>
            </div>
            <Row className="align-items-center mb-4">
                <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }} className="text-right">
                    <FormLabel>Collection Name: </FormLabel>
                </Col>
                <Col md={{ span: 5 }} sm={{ span: 7 }}>
                    <FormControl placeholder="Enter Collection Name" type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 2, offset:1 }} sm={{ span: 3 }} className="text-right">
                    <FormCheck inline label="API driven" type="checkbox"/>
                </Col>
                <Col md={{ span: 8}} sm={{ span:9 }}>
                    <Card
                        content={
                            <div >
                                <Row className="mt-0">
                                    <FormText  className="text-center w-100">Choose the sports for this collection</FormText>
                                </Row>
                                <Row className="d-flex justify-content-center mb-0">
                                    <FormCheck inline label="NBA" type="checkbox"/>
                                    <FormCheck inline label="NFL" type="checkbox"/>
                                    <FormCheck inline label="MLB" type="checkbox"/>
                                    <FormCheck inline label="NCAAB" type="checkbox"/>
                                    <FormCheck inline label="NCAAF" type="checkbox"/>
                                </Row>
                            </div>
                        }
                    />
                    <Card
                        content={
                            <div >
                                <Row className="mt-0">
                                    <Col md={{ span: 9 }}>
                                        <FormGroup>
                                            <FormLabel>SQL statement:</FormLabel>
                                            <FormControl as="textarea" rows={3}></FormControl>
                                        </FormGroup>
                                    </Col>
                                    <Col md={{ span: 3}} className="align-items-center d-flex justify-content-center">
                                        <Button variant="info" className="btn-fill">Test SQL</Button>
                                    </Col>
                                </Row>
                            </div>
                        }
                    />
                </Col>
            </Row>

            <Row>
                <Col md={{ span: 10, offset:1 }} sm={{ span: 12 }}>
                    <Button variant="info" className="btn-fill">Add New Field</Button>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 10, offset:1 }} sm={{ span: 12 }}>
                    <Card
                        content={
                            <div >
                                <Row className="align-items-center">
                                    <Col md={{ span:2 }} className="text-right">
                                        <FormLabel>Field Name: </FormLabel>
                                    </Col>
                                    <Col md={{ span:3 }}>
                                        <FormControl type="text"/>
                                    </Col>
                                    <Col md={{ span:2 }} className="text-right">
                                        <FormLabel>Field Type: </FormLabel>
                                    </Col>
                                    <Col md={{ span:3 }}>
                                        <FormControl as="select">
                                            <option>option 1</option>
                                            <option>option 2</option>
                                        </FormControl>
                                    </Col>
                                    <Col md={{ span:2 }} className="justify-content-center d-flex">
                                        <Button variant="info" className="btn-fill">Remove</Button>
                                    </Col>
                                </Row>

                                <Row className="align-items-center">
                                    <Col md={{ span:2 }} className="text-right">
                                        <FormLabel>Field Name: </FormLabel>
                                    </Col>
                                    <Col md={{ span:3 }}>
                                        <FormControl type="text"/>
                                    </Col>
                                    <Col md={{ span:2 }} className="text-right">
                                        <FormLabel>Field Type: </FormLabel>
                                    </Col>
                                    <Col md={{ span:3 }}>
                                        <FormControl as="select">
                                            <option>option 1</option>
                                            <option>option 2</option>
                                        </FormControl>
                                    </Col>
                                    <Col md={{ span:2 }} className="justify-content-center d-flex">
                                        <Button variant="info" className="btn-fill">Remove</Button>
                                    </Col>
                                </Row>
                            </div>
                        }
                        legend={
                            <Row>
                                <Col md={{ span: 2, offset: 4 }} className="d-flex justify-content-center">
                                    <Button variant="warning" className="btn-fill">Cancel</Button>
                                </Col>
                                <Col md={{ span: 2}} className="d-flex justify-content-center">
                                    <Button variant="primary" className="btn-fill">Save</Button>
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

export default AddCollection;
