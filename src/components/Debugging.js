/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Card, CardBody, CardTitle, CardHeader, Collapse } from 'mdbreact';
import PropTypes from 'prop-types';

import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import {Memory, Registers} from '../utils/util.js';

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class Debugging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegisters: this.props.showRegisters,
      showMemory: this.props.showMemory
    }
  }

  render() {
    return (
      <Card style={{ marginTop: '1rem', width:"100%"}} id="debugging">
        <CardHeader color="default-color" className="text-center">
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

Debugging.propTypes = {
  showRegisters: PropTypes.bool,
  showMemory: PropTypes.bool,
  studentRegisters: PropTypes.instanceOf(Registers),
  referenceRegisters: PropTypes.instanceOf(Registers),
  studentMemory: PropTypes.instanceOf(Memory)
}

export default Debugging;
