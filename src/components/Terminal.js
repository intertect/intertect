/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Card, CardBody, CardTitle, CardHeader, CardFooter,
  Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Tooltip, Footer } from 'mdbreact';

import Typist from 'react-typist';
import posed from 'react-pose';
import AceEditor from 'react-ace';
import SlidingPane from 'react-sliding-pane';

import 'brace/mode/javascript';
import 'brace/theme/chrome';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/twilight';

import {Memory, Registers, nameToRegisterMap} from '../utils/util.js';
import FooterPage from './FooterPage.js'

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const TransitionTerminal = posed.div({
  start: {
    x: "50%"
  },
  end: {
    x: "5%",
    transition: {
      duration: 2500
    }
  }
});

function LinkWithTooltip({ id, children, href, tooltip }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
      placement="top"
      delayShow={300}
      delayHide={150}
    >
      <a href={href}>{children}</a>
    </OverlayTrigger>
  );
}

class Terminal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLesson: false,
      theme: "solarized_dark",

      currentStep: 0,
      targetStep: 0,

      isPaneOpen: true,
      completedInstructions: false,

      lesson: 1,
      lessonPart: 1,
      loadLesson: true,

      studentProgram: "",
      assemblyProgram: [],
      memory: new Memory(),
      registers: new Registers(),
      targetRegisters: new Registers(),

      test: false
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.loadLesson = this.loadLesson.bind(this);
  }

  handleSelect(evt) {
    this.setState({ theme: evt });
  }

  onChange(newValue) {
    this.setState({ studentProgram: newValue});
  }

  loadLesson() {
    this.setState({
      lessonCorrect : false,
      currentStep : 0,
      targetStep : 0
    });

    var studentProgram, assemblyProgram, initRegisters, targetRegisters;
    var starterCode = `../starter/lesson_${this.state.lesson}-${this.state.lessonPart}.js`;
    fetch(starterCode)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ studentProgram : text });
    })

    var lessonDir = `../lesson_programs/lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
    fetch(lessonDir + "/prog.s")
    .then((r)  => r.text())
    .then(text => {
      this.setState({ assemblyProgram : text.split("\n") });
    })

    fetch(lessonDir + "/init.txt")
    .then((r)  => r.text())
    .then(text => {
      initRegisters = new Registers();
      initRegisters.load(text);
      this.setState({ registers : initRegisters });
    })

    fetch(lessonDir + "/final.txt")
    .then((r)  => r.text())
    .then(text => {
      targetRegisters = new Registers();
      targetRegisters.load(text);
      this.setState({ targetRegisters : targetRegisters });
    })

    this.setState({ loadLesson : false });
  }

  render() {
    if (this.state.loadLesson) {
      this.loadLesson();
    }

    if (this.state.currentStep != this.state.targetStep) {
      this.setState({
        currentStep : this.state.currentStep + 1
      });

      var script = document.createElement('script');
      try {
        script.appendChild(document.createTextNode(this.state.studentProgram));
        document.body.appendChild(script);
      } catch (e) {
        script.text = this.state.studentProgram;
        document.body.appendChild(script);
      }

      execute(this.state.assemblyProgram[this.state.currentStep]
        .replace(/,/g,"")
        .split(" "),
        this.state.registers)

      if (this.state.currentStep == (this.state.assemblyProgram.length - 2)) {
        this.setState({
          lessonCorrect : this.state.registers.compareRegisters(this.state.targetRegisters)
        });
      }
    }

    let continuationButton;
    if (this.state.lessonCorrect) {
      continuationButton =
        <Button rounded outline style={{width:"100%"}}
            onClick={() => {
            this.setState({
              lessonPart : this.state.lessonPart + 1,
              loadLesson : true,
              isPaneOpen: true
            });
          }}> Next Lesson
        </Button>
    } else {
      continuationButton =
        <Button rounded outline style={{width:"100%"}} disabled> Next Lesson </Button>
    }

    var assemblyList = [];
    for (var i = 0; i < this.state.assemblyProgram.length; i++) {
      assemblyList.push(
        <span className={this.state.currentStep == i ? "active" : "inactive"}>
          {this.state.assemblyProgram[i]}<br/>
        </span>);
    }

    var registerTable = [];
    var registers = Object.keys(nameToRegisterMap);
    for (var i = 0; i < registers.length; i++) {
      var register = registers[i];
      registerTable.push(<tr style={{textAlign: 'center'}} className="source-code">
          <td>{register}</td>
          <td><div><small>0x{this.state.registers.read(nameToRegisterMap[register]).toString(16).toUpperCase()}</small></div></td>
        </tr>);
    }

    return (this.state.selectedLesson ?

      <div>
        <SlidingPane
            isOpen={ this.state.isPaneOpen }
            title={ 'Lesson ' + this.state.lesson + '.' + this.state.lessonPart }
            width='50%'
            onRequestClose={ () => {
              this.setState({ isPaneOpen: false });
            }}>
            <div className="shell-wrap">
              <ul className="shell-body">
                <Typist
                  onTypingDone={() => {
                    this.setState({
                      completedInstructions: true
                    })}}>
                <Typist.Delay ms={500} />

                <li>Hey there!</li>
                <li>
                  In this lesson, we gonna learn about computer <Tooltip
                    placement="top"
                    component="a"
                    tooltipContent="Increased KNOWLEDGE"> architecture </Tooltip>
                </li>

                </Typist>
              </ul>
            </div><br />
        </SlidingPane>

        <div className="col-sm-12">
          <div className="col-sm-6">
            <Card style={{ marginTop: '1rem'}} className="text-center">
              <CardHeader color="default-color">
                <CardTitle componentClass="h4">
                  Implement&nbsp;
                </CardTitle>
              </CardHeader>
              <CardBody>
                <AceEditor
                  mode="javascript"
                  theme={this.state.theme}
                  onChange={this.onChange}
                  name="UNIQUE_ID"
                  editorProps={{$blockScrolling: true}}
                  value={this.state.studentProgram}
                />
              </CardBody>
              <CardFooter color="stylish-color">
                <div className="col-sm-6">
                  <Dropdown>
                    <DropdownToggle caret rounded outline color="default" style={{width:"100%"}}>
                      {this.state.theme}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => {this.setState({ theme : "chrome" })}} eventKey="chrome" className={this.state.theme == "chrome" ? "active" : "inactive"}>chrome</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "dracula" })}} eventKey="dracula" className={this.state.theme == "dracula" ? "active" : "inactive"}>dracula</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "eclipse" })}} eventKey="eclipse" className={this.state.theme == "eclipse" ? "active" : "inactive"}>eclipse</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "github" })}} eventKey="github" className={this.state.theme == "github" ? "active" : "inactive"}>github</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "monokai" })}} eventKey="monokai" className={this.state.theme == "monokai" ? "active" : "inactive"}>monokai</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "solarized_dark" })}} eventKey="solarized_dark" className={this.state.theme == "solarized_dark" ? "active" : "inactive"}>solarized_dark</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "solarized_light" })}} eventKey="solarized_light" className={this.state.theme == "solarized_light" ? "active" : "inactive"}>solarized_light</DropdownItem>
                      <DropdownItem onClick={() => {this.setState({ theme : "twilight" })}} eventKey="twilight" className={this.state.theme == "twilight" ? "active" : "inactive"}>twilight</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="col-sm-6">
                  { continuationButton }
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="col-sm-6">
            <Card style={{ marginTop: '1rem'}}>
              <CardHeader color="default-color" className="text-center">
                <CardTitle componentClass="h4">Code</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="shell-body" >{ assemblyList }</ul>
              </CardBody>
              <CardFooter color="stylish-color">
                <div className="row">
                  <div className="col-sm-4"> <Button rounded outline style={{width:"100%"}}
                  onClick={() => this.setState({ targetStep : this.state.assemblyProgram.length - 1 })}>
                    <span className="glyphicon glyphicon-play"></span> Run
                  </Button> </div>
                  <div className="col-sm-4"> <Button rounded outline style={{width:"100%"}}
                  onClick={() => this.setState({ targetStep : this.state.targetStep + 1 })}>
                    <span className="glyphicon glyphicon-forward"></span> Step
                  </Button> </div>
                  <div className="col-sm-4"> <Button rounded outline style={{width:"100%"}}
                    onClick={() => {this.setState({ loadLesson : true })}}>
                    <span className="glyphicon glyphicon-repeat"></span> Reset
                  </Button> </div>
                </div>
              </CardFooter>
            </Card>

            <Card style={{ marginTop: '1rem'}} className="text-center">
              <CardHeader color="default-color">
                <CardTitle componentClass="h1">CPU & Memory</CardTitle>
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
          </div>
        </div>
      </div>

      :

      <div>
        <div className="col-sm-6 col-sm-offset-3" style={{position: "absolute", top:"25%"}}>
          <Card style={{ marginTop: '1rem'}} className="text-center">
            <CardHeader color="default-color">
              <CardTitle componentClass="h1">Intertect</CardTitle>
            </CardHeader>
            <CardBody>
              <Button rounded outline onClick={() => {
                this.setState({ selectedLesson : true })}}>
                Lesson 1
              </Button><br />
              <Button rounded outline disabled>Lesson 2</Button><br />
              <Button rounded outline disabled>Lesson 3</Button><br />
              <Button rounded outline disabled>Lesson 4</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default Terminal;
