
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
import {connect} from "react-redux"
import axios from 'axios'
import Moment from 'moment';
// import DateTime from "react-intl-datetime-format"

class RepairOrderList extends Component {
  state = {
    claims: []
  }

  componentDidMount() {
    setTimeout(() => {
      console.log("token = ", this.props.token)
      const headers = { 
        'Authorization': 'token ' + this.props.token,
      };
      axios.get('http://localhost:8000/api/claim/claim/?dealership=' + this.props.dealership, {headers})
        .then(res => {
          const claims = res.data;
          this.setState({ claims });
        })
    }, 100);
    
  }

  render() {
    const edit = <Tooltip id="edit">Edit Schedule</Tooltip>;
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    const actions = (
      <td className="td-actions">
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
    Moment.locale('en');
    return (
      <div className="main-content">
        <Container fluid>
          <div className="d-flex">
            <FormLabel className="mx-auto h1 "><b>Repair Order List</b></FormLabel>
          </div>
          <Row>
            <Col md={{ span: 10, offset: 1 }} sm={{ span: 12 }}>
              <Card
                tableFullWidth
                textCenter
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Repair Order#</th>                        
                        <th>Claim Type</th> 
                        <th>Submission Type</th>
                        <th>Service Advisor</th>
                        <th>Technician</th>
                        <th>Claim PDF</th>
                        <th>Uploaded Date</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.claims.map(claim => 
                        <tr>
                          <td>{claim.repair_order}</td>
                          <td>{claim.claim_type}</td>
                          <td>{claim.submission_type}</td>
                          <td>{claim.service_advisor}</td>
                          <td>{claim.technician}</td>
                          <td>{claim.pdf.substring(claim.pdf.lastIndexOf("/")+1, claim.pdf.length)}</td>
                          <td>{Moment(claim.upload_date).format('MMMM Do YYYY, hh:mm:ss a')}</td>
                          {/* {actions} */}
                        </tr>
                      )}
                    </tbody>
                  </Table>
                }
                legend={
                  <div class="d-flex">
                    <Link to="/frontend/dealership/upload_pdf" className="mx-auto btn btn-primary btn-fill">
                      Add Repair Order
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

// export default RepairOrderList;

const mapStateToProps = state => ({
  claim_types: state.auth.claim_types.claim_types.map(d => ({
    "value" : d.name,
    "label" : d.name
  })),
  submission_types: state.auth.submission_types.submission_types.map(d => ({
    "value" : d.name,
    "label" : d.name
  })),
  service_advisors: state.auth.service_advisors.service_advisor.map(d => ({
    "value" : d.id,
    "label" : d.name
  })),
  technicians: state.auth.technicians.technicians.map(d => ({
    "value" : d.id,
    "label" : d.name
  })),
  token: state.auth.access.token,
  dealership: state.auth.user.dealership,
});

export default connect(mapStateToProps)(RepairOrderList);