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

import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class Debugging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unviewedMemoryExplanation: true,
      showRegisters: this.props.showRegisters,
      showMemory: this.props.showMemory
    }
  }

  render() {
    var pulsatingInterest =
      <div className="pulsating-dot__ripple">
        <span></span>
        <div></div>
        <div></div>
        <div></div>
      </div>;

    var memoryExplanation;
    if (this.state.unviewedMemoryExplanation) {
      memoryExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is debug corner! You{"'"}ll see all the values of registers and memory in this
          area, which you can use for debugging what{"'"}s is going on when you run your program.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedMemoryExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      memoryExplanation = <div></div>
    }

    return (
      <Card style={{ marginTop: '1rem', width:"100%"}}>
        <CardHeader color="default-color" className="text-center">
          {memoryExplanation}
          <CardTitle componentclassName="h4">
            Debugging
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-sm-6">
              <Button outline
                onClick={() => this.setState({ showRegisters : !this.state.showRegisters })} style={{width:"100%"}}>
                {this.state.showRegisters ? "Hide" : "Show" } Registers
              </Button>

              <Collapse isOpen={this.state.showRegisters}>
                <RegistersTable
                  studentRegisters={this.props.studentRegisters}
                  referenceRegisters={this.props.referenceRegisters}
                />
              </Collapse>
            </div>

            <div className="col-sm-6">
              <Button outline
                onClick={() => this.setState({ showMemory : !this.state.showMemory })} style={{width:"100%"}}>
                {this.state.showMemory ? "Hide" : "Show"} Memory
              </Button>
              <Collapse isOpen={this.state.showMemory}>
                <MemoryTable
                  memory={this.props.studentMemory}
                />
              </Collapse>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Debugging;
