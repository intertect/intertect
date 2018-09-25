import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Tooltip, Table  } from 'mdbreact';
import PropTypes from 'prop-types';

import {Registers, nameToRegisterMap, registerToNameMap} from '../utils/util.js';

import '../styles/intro.css';

class RegistersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    var registerTable = [];
    var register;
    for (var i = 0; i < this.props.studentRegisters.usedRegisters.length; i++) {
      register = this.props.studentRegisters.usedRegisters[i];

      var studentValue = `0x${this.props.studentRegisters.read(register).toString(16).toUpperCase()}`;
      var referenceValue = `0x${this.props.referenceRegisters.read(register).toString(16).toUpperCase()}`;

      var color, tooltipContent;
      if (studentValue == referenceValue) {
        color = "#00C851";
        tooltipContent = "Great job! This is correct.";
      } else {
        color = "#ff4444";
        tooltipContent = `Sorry, try again! We expected: ${referenceValue}`;
      }

      registerTable.push(<tr style={{textAlign: 'center', background: color}} className="source-code">
        <td>{registerToNameMap[register]}</td>
        <td>
          <Tooltip
            placement="top"
            tooltipContent={tooltipContent}>
              <a style={{textDecoration: "underline", color: "white"}}>{studentValue}</a>
          </Tooltip>
        </td>
      </tr>);
    }

    var registers = Object.keys(nameToRegisterMap);
    for (i = 0; i < registers.length; i++) {
      register = registers[i];
      if (this.props.studentRegisters.usedRegisters.indexOf(register) != -1) {
        continue;
      }

      registerTable.push(<tr style={{textAlign: 'center'}} className="source-code">
          <td>{register}</td>
          <td>0x{this.props.studentRegisters.read(nameToRegisterMap[register]).toString(16).toUpperCase()}</td>
        </tr>);
    }

    return (
      <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center">
        <CardHeader color="default-color">
          <CardTitle componentclassName="h1">
            Registers
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Table hover condensed>
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>Register</th>
                <th style={{textAlign: 'center'}}>Value</th>
              </tr>
            </thead>
            <tbody> { registerTable } </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

RegistersTable.propTypes = {
  studentRegisters: PropTypes.instanceOf(Registers),
  referenceRegisters: PropTypes.instanceOf(Registers)
}

export default RegistersTable;
