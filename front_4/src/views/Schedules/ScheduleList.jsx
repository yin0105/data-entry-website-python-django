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
  Tooltip
} from "react-bootstrap";
import { Link } from "react-router-dom"
// react component that creates a switch button that changes from on to off mode
import Switch from "react-bootstrap-switch";

import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";

import img1 from "assets/img/blog-1.jpg";
import img2 from "assets/img/blog-2.jpg";
import img3 from "assets/img/blog-3.jpg";
import img4 from "assets/img/blog-4.jpg";
import img5 from "assets/img/blog-5.jpg";

class ScheduleList extends Component {
  render() {
    const edit = <Tooltip id="edit">Edit Schedule</Tooltip>;
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    const actions = (
      <td className="td-actions text-center">
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
    return (
      <div className="main-content">
        <Container fluid>
          <Row>
            <Col md={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }}>
              <Card
                title="Schedules List"
                category=""
                tableFullWidth
                textCenter
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Schedule Name</th>
                        <th className="text-center">Action</th>                        
                        <th className="text-center">Active</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Andrew Mike</td>
                        {actions}
                        <td className="text-center">
                          <Switch onText="" offText="" defaultValue={false} />
                        </td>
                      </tr>
                      <tr>
                        <td>John Doe</td>
                        {actions}
                        <td className="text-center">
                          <Switch onText="" offText="" defaultValue={false} />
                        </td>
                      </tr>
                      <tr>
                        <td>Alex Mike</td>
                        {actions}
                        <td className="text-center">
                          <Switch onText="" offText="" defaultValue={false} />
                        </td>
                      </tr>
                      <tr>
                        <td>Mike Monday</td>
                        {actions}
                        <td className="text-center">
                          <Switch onText="" offText="" defaultValue={false} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                }
                legend={
                  <div class="d-flex">
                    <Link to="/admin/add_schedule" className="mx-auto btn btn-primary btn-fill">
                      Add Schedule
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

export default ScheduleList;
