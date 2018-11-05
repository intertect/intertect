/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Collapse } from 'mdbreact';

import PropTypes from 'prop-types';
import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import { Memory, Registers } from '../utils/util.js';

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
      <div className="lesson-debugging d-flex" id="debugging">
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
