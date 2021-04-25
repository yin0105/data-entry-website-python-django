import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormText,
  FormControl,
  FormCheck,
  Form,
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Link } from "react-router-dom"
import { loadFromLocalStorage } from "redux/reducers/auth";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'
import axios from 'axios'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { isJSDocNullableType } from "typescript";


const fieldTypeOptions = [
    { value: 'numeric', label: 'numeric' },
    { value: 'teamname', label: 'teamname' },
    { value: 'freeform', label: 'freeform' },
]

class AddCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAPI: false,
            collectionName: '',
            inputList: [],
            sports: [],
            show: false,
            sqlResults: [],
        }
    };

    sports_ids = loadFromLocalStorage("sports_ids");
    token = loadFromLocalStorage("token");

    handleCollectionNameChange = (e) => {
        this.setState({collectionName: e.target.value});
    };

    handleIsAPIChange = e => {
        this.setState({ isAPI: e.target.checked });
    };

    handleFieldNameChange = (e, index) => {
        const { value } = e.target;
        const list = [...this.state.inputList];
        list[index]['fieldName'] = value;
        this.setState({inputList: list});
    };

    handleFieldTypeChange = (e, index) => {
        const { value } = e.target;
        const list = [...this.state.inputList];
        list[index]['fieldType'] = value;
        this.setState({inputList: list});
    };
    
    // handle click event of the Remove button
    handleRemoveField = index => {
        const list = [...this.state.inputList];
        list.splice(index, 1);
        this.setState({inputList: list});
    };
    
    // handle click event of the Add button
    handleAddNewField = () => {
        this.setState({inputList: [...this.state.inputList, { fieldName: "", fieldType: "numeric" }]});
        console.log("inputList =>", this.state.inputList)
    };

    handleSportsChange = (e, index, sport_id) => {        
        if (this.state.sports.length == 0) {
            this.sports_ids.map((x) => this.setState(state => ({
                items: [...state.sports, 0]
              }))
            )
        }
        let list = [...this.state.sports];
        list[index] = e.target.checked? sport_id: 0;
        this.setState({sports: list});
    };

    handleSave = () => {
        if (this.state.collectionName == "") {
            this.createNotification('error', 'Collection name is missing!', 'Please enter collection name.')
            return
        }
        const list = [...this.state.inputList];
        let isEmpty = false;
        let field_names = [], field_types = []

        list.map((x, i) => {
            if (x.fieldName == "") {
                isEmpty = true;
                return
            }
            field_names.push(x.fieldName)
            field_types.push(x.fieldType)
        })
        if (isEmpty) {
            this.createNotification('error', 'Field Name is missing!', 'Please enter field name.')
            return
        }
        let sports_list = []
        if (this.state.isAPI) {
            this.state.sports.map((x) => {
                if (x > 0) {sports_list.push(x)}
            })
        } else {
            sports_list.push('0')
            sports_list.push(this.state.sql)
        }
        console.log("sports_list = ", sports_list)
        
        // Add Collection
        let form_data = new FormData();

        form_data.append('name', this.state.collectionName);
        form_data.append('sports', sports_list.join("::"));
        form_data.append('field_names', field_names.join("::"));
        form_data.append('field_types', field_types.join("::"));
        let url = '/api/data_entry/collection/';
        axios.post(url, form_data, {
            headers: {
                'Authorization': 'token ' + this.token,
            }
        }).then(res => {
            this.createNotification('success', 'New collection has been added successfully!', '')
            return
        }).catch(err => {
            this.createNotification('error', err, '')
            return
        })
    };

    handleTestSQL = e => {
        e.preventDefault();
        // let sql = e.target.elements.sql.value;
        const { sql } = this.state
        let form_data = new FormData();
        form_data.append('run_sql', 1);
        form_data.append('sql', sql);
        let url = '/api/data_entry/collection/';
        axios.post(url, form_data, {
            headers: {
                'Authorization': 'token ' + this.token,
            }
        }).then(res => {
            this.setState({sqlResults: res.data.res})
            this.setState({show: true})
        })
    }

    handleClose = () => {
        this.setState({show: false})
    }

    handleSQLChange = e => {
        console.log("e.target.value = ", e.target.value)
        this.setState({sql: e.target.value})
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
        console.log("this.state.show = ", this.state.show)
        return (
        <div className="main-content">
            <Container fluid>
                <div className="d-flex">
                    <FormLabel className="mx-auto h1 "><b>Create New Collection</b></FormLabel>
                </div>
                <Row className="align-items-center mb-4">
                    <Col md={{ span: 3, offset: 2 }} sm={{ span: 5 }} className="text-right">
                        <FormLabel>Collection Name: </FormLabel>
                    </Col>
                    <Col md={{ span: 5 }} sm={{ span: 7 }}>
                        <FormControl placeholder="Enter Collection Name" type="text" value={this.state.collectionName} onChange={e => this.handleCollectionNameChange(e)}/>
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
                                        {this.sports_ids.map((x, i) => {                                            
                                            return (<FormCheck inline label={x.sport_name} value={x.sport_id} type="checkbox" onClick={e => this.handleSportsChange(e, i, x.sport_id)}/>);
                                        })}
                                    </Row>
                                </div>
                            }
                        />
                    }
                    {
                        !this.state.isAPI && 
                        <Form onSubmit={this.handleTestSQL}>
                            <Card
                                content={
                                    <div >
                                        <Row className="mt-0">
                                            <Col md={{ span: 9 }}>
                                                <FormGroup>
                                                    <FormLabel>SQL statement:</FormLabel>
                                                    <FormControl as="textarea" rows={3} name="sql" onChange={e => this.handleSQLChange(e)}></FormControl>
                                                </FormGroup>
                                            </Col>
                                            <Col md={{ span: 3}} className="align-items-center d-flex justify-content-center">
                                                <Button variant="info" className="btn-fill" type="submit">Test SQL</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                            />
                        </Form>
                    }
                    </Col>
                </Row>
                {/* <Modal isOpen={true}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary">
                        Close
                    </Button>
                    <Button variant="primary">
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal> */}
                

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
                                        return (
                                            <Row className="align-items-center">
                                                <Col md={{ span:2 }} className="text-right">
                                                    <FormLabel>Field Name: </FormLabel>
                                                </Col>
                                                <Col md={{ span:3 }}>
                                                    <FormControl type="text" value={x.fieldName} onChange={e => this.handleFieldNameChange(e, i)}/>
                                                </Col>
                                                <Col md={{ span:2 }} className="text-right">
                                                    <FormLabel>Field Type: </FormLabel>
                                                </Col>
                                                <Col md={{ span:3 }}>
                                                    <FormControl as="select" selectedValue={x.fieldType} onChange={e => this.handleFieldTypeChange(e, i)}>
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
                                        <Button variant="primary" className="btn-fill" onClick={() => this.handleSave()}>Save</Button>
                                    </Col>
                                </Row>
                            }
                        />
                    </Col>
                </Row>
                <NotificationContainer/>
            </Container>
            <Modal
                isOpen={this.state.show}
                parentSelector={() => document.querySelector('#root')}
                // aria={{
                //     labelledby: "heading",
                //     describedby: "full_description"
                // }}
            >
                <h2 className="text-center">Test SQL</h2>
                <table style={{border: 1}} className="sql">
                    <thead>
                        {this.state.sqlResults.length > 0 && this.state.sqlResults[0].map(x => {
                            return (<th>{x}</th>)
                        })}
                    </thead>
                    <tbody>
                        {this.state.sqlResults.map((row, i) => {
                            if (i>0) {
                                return (<tr>
                                    {row.map(x => {
                                        return <td>{x}</td>
                                    })}
                                </tr>)                               
                                
                            }
                        })}
                    </tbody>
                </table>
                {/* <FormControl as="textarea" rows={10} name="sql" readOnly={true}></FormControl> */}
                <div className="d-flex mt-4">
                    <Button variant="primary" className="btn-fill mx-auto" onClick={() => this.setState({show: false})}>Close</Button>
                </div>
            </Modal>
        </div>
        );
    }
}

export default AddCollection;
