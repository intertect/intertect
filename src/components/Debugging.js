/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Popover, PopoverHeader, PopoverBody, Collapse } from 'mdbreact';
import PropTypes from 'prop-types';

import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import { Memory, Registers } from '../utils/util.js';

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
      <div className="lesson-debugging d-flex">
        {memoryExplanation}
        <div className="col-6 text-center">
          <Button className="m-0" onClick={() => this.setState({ showRegisters : !this.state.showRegisters })}>
            CPU REGISTERS
          </Button>

          <Collapse className="lesson-debugging__collapsible" isOpen={this.state.showRegisters}>
            <RegistersTable
              studentRegisters={this.props.studentRegisters}
              referenceRegisters={this.props.referenceRegisters}
            />
          </Collapse>
        </div>

        <div className="col-6 text-center">
          <Button className="m-0" onClick={() => this.setState({ showMemory : !this.state.showMemory })}>
            MEMORY
          </Button>
          <Collapse className="lesson-debugging__collapsible" isOpen={this.state.showMemory}>
            <MemoryTable
              memory={this.props.studentMemory}
            />
          </Collapse>
        </div>
      </div>
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
