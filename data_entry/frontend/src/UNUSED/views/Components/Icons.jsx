
/*eslint-disable*/
import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";

import Card from "components/Card/Card";
import { iconsArray } from "variables/Variables.jsx";
import {
  faWeb,
  faHand,
  faTransport,
  faGender,
  faFiles,
  faSpinner,
  faForms,
  faPayment,
  faChart,
  faCurrency,
  faText,
  faDirectional,
  faVideo,
  faBrand,
  faMedical
} from "variables/faVariables.jsx";

class Icons extends Component {
  faMap(faToMap) {
    return faToMap.map((prop, key) => {
      return (
        <Col md={3} sm={4} className="font-icon-container" key={key}>
          <a href="#pablo" onClick={e => e.preventDefault()}>
            <i className={prop} />
            {" " + prop}
          </a>
        </Col>
      );
    });
  }
  render() {
    return (
      <div className="main-content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card
                title="202 Awesome Stroke Icons"
                category={
                  <span>
                    Handcrafted by our friends from{" "}
                    <a
                      target="_blank"
                      href="http://themes-pixeden.com/font-demos/7-stroke/index.html"
                    >
                      Pixeden
                    </a>
                  </span>
                }
                ctAllIcons
                content={
                  <Row>
                    {iconsArray.map((prop, key) => {
                      return (
                        <Col lg={2} md={3} sm={4} xs={6} key={key}>
                          <div className="font-icon-detail">
                            <i className={prop} />
                            <input type="text" defaultValue={prop} />
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                }
              />
              <Card
                title="Font Awesome Icons"
                category={
                  <span>
                    Check out more on their{" "}
                    <a
                      href="https://fortawesome.github.io/Font-Awesome/"
                      target="_blank"
                    >
                      website
                    </a>
                    .
                  </span>
                }
                ctAllIcons
                content={
                  <Container fluid>
                    <Row>
                      <h5>Web Application Icons</h5>
                      {this.faMap(faWeb)}
                    </Row>
                    <Row>
                      <h5>Hand Icons</h5>
                      {this.faMap(faHand)}
                    </Row>
                    <Row>
                      <h5>Transportation Icons</h5>
                      {this.faMap(faTransport)}
                    </Row>
                    <Row>
                      <h5>Gender Icons</h5>
                      {this.faMap(faGender)}
                    </Row>
                    <Row>
                      <h5>File Type Icons</h5>
                      {this.faMap(faFiles)}
                    </Row>
                    <Row>
                      <h5>Spinner Icons</h5>
                      {this.faMap(faSpinner)}
                    </Row>
                    <Row>
                      <h5>Form Control Icons</h5>
                      {this.faMap(faForms)}
                    </Row>
                    <Row>
                      <h5>Payment Icons</h5>
                      {this.faMap(faPayment)}
                    </Row>
                    <Row>
                      <h5>Chart Icons</h5>
                      {this.faMap(faChart)}
                    </Row>
                    <Row>
                      <h5>Currency Icons</h5>
                      {this.faMap(faCurrency)}
                    </Row>
                    <Row>
                      <h5>Text Editor Icons</h5>
                      {this.faMap(faText)}
                    </Row>
                    <Row>
                      <h5>Directional Icons</h5>
                      {this.faMap(faDirectional)}
                    </Row>
                    <Row>
                      <h5>Video Player Icons</h5>
                      {this.faMap(faVideo)}
                    </Row>
                    <Row>
                      <h5>Brand Icons</h5>
                      {this.faMap(faBrand)}
                    </Row>
                    <Row>
                      <h5>Medical Icons</h5>
                      {this.faMap(faMedical)}
                    </Row>
                  </Container>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Icons;
