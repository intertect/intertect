import React, { Component } from 'react';
import { Table  } from 'mdbreact';
import PropTypes from 'prop-types';

import { Memory } from '../utils/util.js';

class MemoryTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var memoryTable = [];
    if (this.props.memory == undefined) return null;

    var memory = Object.keys(this.props.memory.memory_);
    for (var i = 0; i < memory.length; i++) {
      var memoryAddr = memory[i];

      var studentMemory = `0x${this.props.memory.read(memoryAddr).toString(16).toUpperCase()}`
      memoryTable.push(<tr>
          <td>{memoryAddr}</td>
          <td>{studentMemory}</td>
        </tr>);
    }

    return (
      <div className="lesson-debugging__memory d-inline-block" id="memoryTable">
        <Table hover condensed>
          <thead>
            <tr>
              <th>Address</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody> { memoryTable } </tbody>
        </Table>
      </div>
    );
  }
}

MemoryTable.propTypes = {
   memory: PropTypes.instanceOf(Memory)
}

export default MemoryTable;
