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
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Link } from "react-router-dom"
import { loadFromLocalStorage } from "redux/reducers/auth";


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
            inputList: [],
        }
    };

    sports_ids = loadFromLocalStorage("sports_ids");

    // componentDidMount() {
    //     // setTimeout(() => {
    //     //     this.props.rapidapi_key = "b50ad1dda9msh31dcaef409c21c6p15cff7jsnc6410d291bd0";
    //     //     this.props.rapidapi_host = "therundown-therundown-v1.p.rapidapi.com";
    //     //     this.props.use_query_string = true;
    //     //     const headers = { 
    //     //         'x-rapidapi-key': this.props.rapidapi_key,
    //     //         'x-rapidapi-host': this.props.rapidapi_host,
    //     //         'useQueryString': this.props.useQueryString,
    //     //     };
    //     //     axios.get('https://therundown-therundown-v1.p.rapidapi.com/sports', {headers})
    //     //         .then(res => {
    //     //             const sports_ids = res.data;
    //     //             this.setState({ sports_ids });
    //     //         })
    //     // }, 100);
    //     this.props.sports_ids = {
    //         "sports": [
    //             {
    //                 "sport_id": 1,
    //                 "sport_name": "NCAA Football"
    //             },
    //             {
    //                 "sport_id": 2,
    //                 "sport_name": "NFL"
    //             },
    //             {
    //                 "sport_id": 3,
    //                 "sport_name": "MLB"
    //             },
    //             {
    //                 "sport_id": 4,
    //                 "sport_name": "NBA"
    //             },
    //             {
    //                 "sport_id": 5,
    //                 "sport_name": "NCAA Men's Basketball"
    //             },
    //             {
    //                 "sport_id": 6,
    //                 "sport_name": "NHL"
    //             },
    //             {
    //                 "sport_id": 7,
    //                 "sport_name": "UFC/MMA"
    //             },
    //             {
    //                 "sport_id": 8,
    //                 "sport_name": "WNBA"
    //             },
    //             {
    //                 "sport_id": 9,
    //                 "sport_name": "CFL"
    //             },
    //             {
    //                 "sport_id": 10,
    //                 "sport_name": "MLS"
    //             }
    //     ]};
    // }

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
                                        {this.sports_ids.sports.map((x, i) => {
                                            return (<FormCheck inline label={x.sport_name} value={x.sport_id} type="checkbox"/>);
                                        })}
                                        
                                        {/* <FormCheck inline label="NFL" type="checkbox"/>
                                        <FormCheck inline label="MLB" type="checkbox"/>
                                        <FormCheck inline label="NCAAB" type="checkbox"/>
                                        <FormCheck inline label="NCAAF" type="checkbox"/> */}
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
