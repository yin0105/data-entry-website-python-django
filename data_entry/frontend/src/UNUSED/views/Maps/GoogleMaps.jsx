
import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
// react components used to create a google map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import MapCard from "components/Card/MapCard.jsx";

const SatelliteMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={3}
      mapTypeId={"satellite"}
      defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
      defaultOptions={{
        scrollwheel: false
      }}
    >
      <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
    </GoogleMap>
  ))
);

const RegularMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
      defaultOptions={{
        scrollwheel: false
      }}
    >
      <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
    </GoogleMap>
  ))
);

class GoogleMaps extends Component {
  render() {
    return (
      <div className="main-content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <MapCard
                title="Satellite Map"
                content={
                  <SatelliteMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `280px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                }
              />
            </Col>
            <Col md={12}>
              <MapCard
                title="Regular Map"
                content={
                  <RegularMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `280px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default GoogleMaps;
