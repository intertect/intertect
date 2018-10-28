/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';

import { Button, Card, CardBody, CardTitle, CardHeader,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Popover, PopoverHeader, PopoverBody,
  Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem,
  Navbar, NavItem, NavbarNav, NavbarBrand, Collapse } from 'mdbreact';
import PropTypes from 'prop-types';

import AceEditor from 'react-ace';

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import 'brace/mode/javascript';
import 'brace/theme/chrome';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/twilight';

class Implement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unviewedImplementExplanation: true,
      theme: this.props.theme,
      studentProgram: this.props.studentProgram
    };
  }

  render() {
    var pulsatingInterest =
      <div className="pulsating-dot__ripple">
        <span></span>
        <div></div>
        <div></div>
        <div></div>
      </div>;

    var implementExplanation;
    if (this.state.unviewedImplementExplanation) {
      implementExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is where you{"'"}ll be implementing your code for the lesson! We{"'"}ve provided
          you with a template to get started.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedImplementExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      implementExplanation = <div></div>
    }

    return (
      <div className="col-sm-6" style={{display: "flex"}}>
        <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center">
          <CardHeader color="default-color">
            {implementExplanation}
            <CardTitle componentclassName="h4">
              Implement
            </CardTitle>
          </CardHeader>
          <CardBody>
            <AceEditor
              mode="javascript"
              theme={this.state.theme}
              onChange={this.props.onChange}
              name="UNIQUE_ID"
              editorProps={{$blockScrolling: true}}
              value={this.props.studentProgram}
              width="100%"
              tabSize="2"
              style={{
                zIndex: 0,
                display: "flex"
              }}
            />
            <br />
            <Dropdown>
              <DropdownToggle caret outline color="default" style={{width:"100%"}}>
                {this.state.theme.replace(/_/g," ")}
              </DropdownToggle>
              <DropdownMenu  style={{width:"100%"}}>
                <DropdownItem onClick={() => {this.setState({ theme : "chrome" })}} eventKey="chrome" className={this.state.theme == "chrome" ? "active" : "inactive"}>chrome</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "dracula" })}} eventKey="dracula" className={this.state.theme == "dracula" ? "active" : "inactive"}>dracula</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "eclipse" })}} eventKey="eclipse" className={this.state.theme == "eclipse" ? "active" : "inactive"}>eclipse</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "github" })}} eventKey="github" className={this.state.theme == "github" ? "active" : "inactive"}>github</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "monokai" })}} eventKey="monokai" className={this.state.theme == "monokai" ? "active" : "inactive"}>monokai</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "solarized_dark" })}} eventKey="solarized_dark" className={this.state.theme == "solarized_dark" ? "active" : "inactive"}>solarized (dark)</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "solarized_light" })}} eventKey="solarized_light" className={this.state.theme == "solarized_light" ? "active" : "inactive"}>solarized (light)</DropdownItem>
                <DropdownItem onClick={() => {this.setState({ theme : "twilight" })}} eventKey="twilight" className={this.state.theme == "twilight" ? "active" : "inactive"}>twilight</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <br />
            <div className="row">
              <div className="col-sm-6">
                <Button outline style={{width:"100%"}}
                    onClick={() => this.saveProgram(this.state.lesson,
                      this.state.lessonPart, this.state.starterProgram)}>
                  <i className="fa fa-save" aria-hidden="true"></i> Save Code
                </Button>
              </div>

              <div className="col-sm-6">
                <Button outline color="danger" style={{width:"100%"}}
                    onClick={() => {this.setState({ confirmRestart : true })}}>
                  <i className="fa fa-warning" aria-hidden="true"></i> Restart Level
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Implement;
