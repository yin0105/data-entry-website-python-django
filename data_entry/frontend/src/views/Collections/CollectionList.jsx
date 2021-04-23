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
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'react-notifications/dist/react-notifications'


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
        this.setState({ collections: res.data });
      });
  }

  onConfirm = () => {
    console.log("onConfirm()");
  }

  handleRemoveClick = (col_id, row_index) => {
    confirmAlert({
      title: 'Confirm to remove',
      message: 'Are you sure to remove this collection.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios.get('/api/data_entry/schedule/', {'headers': this.headers})
              .then(res => {
                let scheduled = false
                res.data.map(row => {
                  if (scheduled) return
                  console.log("row.collection, col_id", row.collection, col_id)
                  if (row.collection == col_id) {
                    scheduled = true
                    return
                  }
                })
                if (scheduled) {
                  this.createNotification('error', '', 'The collection has already been scheduled. Please first delete the related scheduled tasks.')
                  return
                } else {
                  axios.delete('/api/data_entry/collection/?id=' + col_id, {'headers': this.headers})
                    .then(res => {
                      console.log("res = ", res.data)
                      this.setState({ collections: res.data });
                      console.log("this.state.collections = ", this.state.collections)
                    })
                }
              })
          }
        },
        {
          label: 'No',
        }
      ]
    });
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
          <NotificationContainer/>
        </Container>
      </div>
    );
  }
}

export default CollectionList;
