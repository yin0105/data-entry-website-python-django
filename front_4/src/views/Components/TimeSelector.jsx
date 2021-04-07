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
import {Container, Row, FormControl } from "react-bootstrap";

class TimeSelector extends Component {
    render() {
        return (
        <div className="time_selector">
            <Container fluid>
                <Row>
                    <FormControl as="select" className="w-100">
                        <option>None</option>
                        <option>00:00</option>
                    </FormControl>
                </Row>
            </Container>
        </div>
        );
    }
}

export default TimeSelector;
