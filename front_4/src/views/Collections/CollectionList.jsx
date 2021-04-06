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
// react component that creates a switch button that changes from on to off mode
import Switch from "react-bootstrap-switch";

import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";

import img1 from "assets/img/blog-1.jpg";
import img2 from "assets/img/blog-2.jpg";
import img3 from "assets/img/blog-3.jpg";
import img4 from "assets/img/blog-4.jpg";
import img5 from "assets/img/blog-5.jpg";

class CollectionList extends Component {
  render() {
    const view = <Tooltip id="view">View Profile</Tooltip>;
    const edit = <Tooltip id="edit">Edit Profile</Tooltip>;
    const remove = <Tooltip id="remove">Remove</Tooltip>;
    const viewPost = <Tooltip id="view">View Post</Tooltip>;
    const editPost = <Tooltip id="edit">Edit Post</Tooltip>;
    const removePost = <Tooltip id="remove">Remove Post</Tooltip>;
    const actions = (
      <td className="td-actions text-right">
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
          <Row>
            <Col md={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }}>
              <Card
                title="Table with Links"
                category="Here is a subtitle for this table"
                tableFullWidth
                content={
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th>Job Position</th>
                        <th className="text-right">Salary</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">1</td>
                        <td>Andrew Mike</td>
                        <td>Develop</td>
                        <td className="text-right">€ 99,225</td>
                        {actions}
                      </tr>
                      <tr>
                        <td className="text-center">2</td>
                        <td>John Doe</td>
                        <td>Design</td>
                        <td className="text-right">€ 89,241</td>
                        {actions}
                      </tr>
                      <tr>
                        <td className="text-center">3</td>
                        <td>Alex Mike</td>
                        <td>Design</td>
                        <td className="text-right">€ 92,144</td>
                        {actions}
                      </tr>
                      <tr>
                        <td className="text-center">4</td>
                        <td>Mike Monday</td>
                        <td>Marketing</td>
                        <td className="text-right">€ 49,990</td>
                        {actions}
                      </tr>
                      <tr>
                        <td className="text-center">5</td>
                        <td>Paul Dickens</td>
                        <td>Communication</td>
                        <td className="text-right">€ 69,201</td>
                        {actions}
                      </tr>
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ExtendedTables;
