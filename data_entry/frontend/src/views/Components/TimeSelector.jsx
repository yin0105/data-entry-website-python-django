
import React, { Component, PropTypes } from "react";
import {Container, Row, FormControl } from "react-bootstrap";
import Select from 'react-select'

class TimeSelector extends Component { 
    constructor(props){
        super(props);
        this.props = {
            ... this.props,
            value: "",
        }
    }    

    onChange = e => {
        this.props.value = e.value
        console.log("this.props.value = ", this.props.value)
    }

    render() {
        const { value } = this.props
        let list = []
        list.push({value: '', label:'None'})
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j++) {
                const tt = ("0"+ String(i)).substr(-2) + ":" + ("0"+ String(j)).substr(-2)
                list.push({value: tt, label: tt})
            }
        }
        return (
        <div className="time_selector">
            <Container fluid>
                <Row>
                    <Select options={list} value={value} onChange={e => onChange(e)}/>
                </Row>
            </Container>
        </div>
        );
    }
}

export default TimeSelector;
