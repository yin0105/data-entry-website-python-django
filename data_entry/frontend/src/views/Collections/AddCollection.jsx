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
//   OverlayTrigger,
//   Tooltip,
  FormGroup,
  FormLabel,
  FormText,
  FormControl,
  FormCheck,
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Link } from "react-router-dom"


const fieldTypeOptions = [
    { value: 'teamname', label: 'teamname' },
    { value: 'freeform', label: 'freeform' },
    { value: 'numeric', label: 'numeric' }
]


class AddCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAPI: false,
            inputList: [],
        }
    };

    handleIsAPIChange = e => {
        this.setState({ isAPI: e.target.checked });
    };

    handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    
    // handle click event of the Remove button
    handleRemoveField = index => {
        const list = [...this.state.inputList];
        list.splice(index, 1);
        console.log("removing", list);
        this.setState({inputList: list});
    };
    
    // handle click event of the Add button
    handleAddNewField = () => {
        console.log('addings')
        this.setState({inputList: [...this.state.inputList, { fieldName: "", fieldType: "abcd" }]});
    };

    render() {
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
                        <FormCheck inline label="API driven" type="checkbox" onChange={this.handleIsAPIChange}/>
                    </Col>
                    <Col md={{ span: 8}} sm={{ span:9 }}>
                    {
                        this.state.isAPI &&
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
                    }
                    {
                        !this.state.isAPI && 
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
                    }
                    </Col>
                </Row>

                <Row>
                    <Col md={{ span: 10, offset:1 }} sm={{ span: 12 }}>
                        <Button variant="info" className="btn-fill" onClick={() => this.handleAddNewField()}>Add New Field</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 10, offset:1 }} sm={{ span: 12 }}>
                        <Card
                            content={
                                <div >
                                    {this.state.inputList.map((x, i) => {
                                        {/* return (
                                            <div className="box">
                                            <input
                                                name="firstName"
                                                placeholder="Enter First Name"
                                                value={x.firstName}
                                                onChange={e => this.handleInputChange(e, i)}
                                            />
                                            <input
                                                className="ml10"
                                                name="lastName"
                                                placeholder="Enter Last Name"
                                                value={x.lastName}
                                                onChange={e => this.handleInputChange(e, i)}
                                            />
                                            <div className="btn-box">
                                                <button
                                                className="mr10"
                                                onClick={() => this.handleRemoveClick(i)}>Remove</button>
                                            </div>
                                            </div>
                                        ); */}
                                        return (
                                            <Row className="align-items-center">
                                                <Col md={{ span:2 }} className="text-right">
                                                    <FormLabel>Field Name: </FormLabel>
                                                </Col>
                                                <Col md={{ span:3 }}>
                                                    <FormControl type="text" value={x.fieldName}/>
                                                </Col>
                                                <Col md={{ span:2 }} className="text-right">
                                                    <FormLabel>Field Type: </FormLabel>
                                                </Col>
                                                <Col md={{ span:3 }}>
                                                    <FormControl as="select" selectedValue={x.fieldType}>
                                                        {fieldTypeOptions.map((xx, ii) => {
                                                            return (<option value={xx.value}>{xx.label}</option>);
                                                        })}
                                                    </FormControl>
                                                </Col>
                                                <Col md={{ span:2 }} className="justify-content-center d-flex">
                                                    <Button variant="info" className="btn-fill" onClick={() => this.handleRemoveField(i)}>Remove</Button>
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                </div>
                            }
                            legend={
                                <Row>
                                    <Col md={{ span: 2, offset: 4 }} className="d-flex justify-content-center">
                                        <Link to="/frontend/admin/collection_list" className="mx-auto btn btn-warning btn-fill">Cancel</Link>
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
