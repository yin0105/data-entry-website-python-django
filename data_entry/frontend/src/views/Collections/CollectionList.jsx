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
import { Link } from "react-router-dom"
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios'
import { loadFromLocalStorage } from "redux/reducers/auth";

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
    }
  };

  token = loadFromLocalStorage("token");
  headers = { 
    'Authorization': 'token ' + this.token,
  };

  componentDidMount() {
    
    axios.get('/api/data_entry/collection/', {'headers': this.headers})
      .then(res => {
        console.log("res = ", res.data)
        this.setState({ collections: res.data });
        console.log("this.state.collections = ", this.state.collections)
      });
  }

  handleRemoveClick = (col_id, row_index) => {
    axios.delete('/api/data_entry/collection/?id=' + col_id, {'headers': this.headers})
      .then(res => {
        console.log("res = ", res.data)
        this.setState({ collections: res.data });
        console.log("this.state.collections = ", this.state.collections)
      });
    // const list = [...this.state.inputList];
    // list.splice(index, 1);
    // this.setState({inputList: list});
  }

  render() {
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>Collection List</b></FormLabel>
          </div>
          <Row>
            <Col md={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }}>
              <Card
                tableFullWidth
                textCenter
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Collection Name</th>                        
                        <th>Action</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.collections.map((x,i) => {
                          return (<tr>
                            <td>{x.name}</td>
                            <td className="td-actions">
                              <OverlayTrigger placement="top" overlay={remove}>
                                <Button simple bsStyle="danger" bsSize="xs" onClick={() => this.handleRemoveClick(x.id, i)}>
                                  <i className="fa fa-times" />
                                </Button>
                              </OverlayTrigger>
                            </td>
                          </tr>)
                        })
                      }
                    </tbody>
                  </Table>
                }
                legend={
                  <div class="d-flex">
                    <Link to="/frontend/admin/add_collection" className="mx-auto btn btn-primary btn-fill">
                      Create New Collection
                    </Link>
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

export default CollectionList;
