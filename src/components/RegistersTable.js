import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Tooltip, Table  } from 'mdbreact';
import PropTypes from 'prop-types';

import {Registers, nameToRegisterMap, registerToNameMap} from '../utils/util.js';

import '../styles/intro.css';

function ToUint32(x) {
  return x >>> 0;
}

class RegistersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    if (this.props.studentRegisters == undefined) return null;

    var registerTable = [];
    var register;
    for (var i = 0; i < this.props.studentRegisters.usedRegisters.length; i++) {
      var studentRegister = this.props.studentRegisters.usedRegisters[i];
      var referenceRegister = this.props.referenceRegisters.usedRegisters[i];

      var studentValue = `0x${ToUint32(this.props.studentRegisters.read(studentRegister)).toString(16).toUpperCase()}`;
      var referenceValue = `0x${ToUint32(this.props.referenceRegisters.read(referenceRegister)).toString(16).toUpperCase()}`;

      var color, tooltipContent;

      if (studentRegister != referenceRegister) {
        color = "#ff4444";
        tooltipContent = `Oops! You wrote to ${registerToNameMap[studentRegister]}
          instead of ${registerToNameMap[referenceRegister]}`
      } else {
        if (studentValue == referenceValue) {
          color = "#00C851";
          tooltipContent = "Great job! This is correct.";
        } else {
          color = "#ff4444";
          tooltipContent = `Sorry, try again! We expected: ${referenceValue}`;
        }
      }

      registerTable.push(<tr style={{textAlign: 'center', background: color}} className="source-code">
        <td>{registerToNameMap[studentRegister]}</td>
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
      if (this.props.studentRegisters.usedRegisters.indexOf(nameToRegisterMap[register]) != -1) {
        continue;
      }

      registerTable.push(<tr style={{textAlign: 'center'}} className="source-code">
          <td>{register}</td>
          <td>0x{this.props.studentRegisters.read(nameToRegisterMap[register]).toString(16).toUpperCase()}</td>
        </tr>);
    }

    return (
      <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center" id="registersTable">
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
