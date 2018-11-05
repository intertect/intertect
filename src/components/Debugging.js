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
    }
  }

  render() {
    return (
      <div className="lesson-debugging d-flex" id="debugging">
        <div className="col-6 text-center">
          <Button className="m-0">
            CPU REGISTERS
          </Button>

          <div className="lesson-debugging__collapsible">
            <RegistersTable
              studentRegisters={this.props.studentRegisters}
              referenceRegisters={this.props.referenceRegisters}
            />
          </div>
        </div>

        <div className="col-6 text-center">
          <Button className="m-0">
            MEMORY
          </Button>
          <div className="lesson-debugging__collapsible">
            <MemoryTable
              memory={this.props.studentMemory}
            />
          </div>
        </div>
      </div>
    );
  }
}

Debugging.propTypes = {
  studentRegisters: PropTypes.instanceOf(Registers),
  referenceRegisters: PropTypes.instanceOf(Registers),
  studentMemory: PropTypes.instanceOf(Memory)
}

export default Debugging;
