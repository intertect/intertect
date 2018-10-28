import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Table  } from 'mdbreact';
import PropTypes from 'prop-types';

import {Memory} from '../utils/util.js';

import '../styles/intro.css';

class MemoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    var memoryTable = [];
    if (this.props.memory == undefined) return null;

    var memory = Object.keys(this.props.memory.memory_);
    for (var i = 0; i < memory.length; i++) {
      var memoryAddr = memory[i];

      var studentMemory = `0x${this.props.memory.read(memoryAddr).toString(16).toUpperCase()}`
      memoryTable.push(<tr style={{textAlign: 'center'}} className="source-code">
          <td>{memoryAddr}</td>
          <td>{studentMemory}</td>
        </tr>);
    }

    return (
      <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center">
        <CardHeader color="default-color">
          <CardTitle componentclassName="h1">
            Memory
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Table hover condensed>
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>Address</th>
                <th style={{textAlign: 'center'}}>Value</th>
              </tr>
            </thead>
            <tbody> { memoryTable } </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

MemoryTable.propTypes = {
   memory: PropTypes.instanceOf(Memory)
}

export default MemoryTable;
