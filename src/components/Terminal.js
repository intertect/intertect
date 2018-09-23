/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Card, CardBody, CardTitle, CardHeader,
  Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Tooltip, Popover, PopoverHeader, PopoverBody,
  Modal, ModalHeader, ModalBody,
  Navbar, NavItem, NavbarNav, NavbarBrand, Collapse } from 'mdbreact';

import FadeIn from 'react-fade-in';
import ReactMarkdown from 'react-markdown';
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

import {Memory, Registers, nameToRegisterMap, registerToNameMap} from '../utils/util.js';

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import {solution_lesson_1_part_1} from '../references/lesson_1/part_1.js'
import {solution_lesson_1_part_2} from '../references/lesson_1/part_2.js'

const solutionsToFunctions = {
  "lesson_1/part_1" : solution_lesson_1_part_1,
  "lesson_1/part_2" : solution_lesson_1_part_2
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
      showMenu: false,
      completedInstructions: false,

      lesson: 1,
      lessonPart: 1,
      lessonContent: "",
      lessonTitle: "Starting Slowly",
      loadLesson: true,
      lessonComplete: false,
      lessonCorrect: true,

      studentProgram: "",
      assemblyProgram: [],
      memory: new Memory(),

      studentRegisters: new Registers(),
      referenceRegisters: new Registers(),
      targetRegisters: new Registers(),

      unviewedAssemblyExplanation: true,
      unviewedStepExplanation: true,
      unviewedImplementExplanation: true,
      unviewedMemoryExplanation: true,
      showTest: false
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
      lessonComplete: false,
      lessonCorrect: true,
      currentStep : 0,
      targetStep : 0
    });

    var initRegisters, referenceRegisters, targetRegisters;
    var starterCode = `../starter/lesson_${this.state.lesson}/part_${this.state.lessonPart}.js`;
    fetch(starterCode)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ studentProgram : text });
    })

    var lessonContentFile = `../content/lesson_${this.state.lesson}/part_${this.state.lessonPart}.md`;
    fetch(lessonContentFile)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ lessonContent : text });
    })

    var lessonDir = `../lesson_programs/lesson_${this.state.lesson}/part_${this.state.lessonPart}/`;
    fetch(lessonDir + "prog.s")
    .then((r)  => r.text())
    .then(text => {
      this.setState({ assemblyProgram : text.split("\n") });
    })

    fetch(lessonDir + "init.txt")
    .then((r)  => r.text())
    .then(text => {
      initRegisters = new Registers();
      initRegisters.load(text);

      referenceRegisters = new Registers();
      referenceRegisters.load(text);

      this.setState({
        studentRegisters : initRegisters,
        referenceRegisters : referenceRegisters
      });
    })

    fetch(lessonDir + "final.txt")
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

      var assemblyInstruction = this.state.assemblyProgram[this.state.currentStep]
        .replace(/,/g,"")
        .split(" ");
      var script = document.createElement('script');
      try {
        script.appendChild(document.createTextNode(this.state.studentProgram));
        document.body.appendChild(script);
      } catch (e) {
        script.text = this.state.studentProgram;
        document.body.appendChild(script);
      }

      // eslint-disable-next-line
      execute(assemblyInstruction, this.state.studentRegisters);

      var lessonPart = `lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
      var solution = solutionsToFunctions[lessonPart];
      solution(assemblyInstruction, this.state.referenceRegisters)

      this.setState({
        lessonCorrect : this.state.studentRegisters.compareRegisters(this.state.referenceRegisters),
        lessonComplete : (this.state.currentStep == (this.state.assemblyProgram.length - 2))
      });
    }

    var assemblyList = [];
    for (var i = 0; i < this.state.assemblyProgram.length-1; i++) {
      assemblyList.push(
        <span className={this.state.currentStep == i ? "active" : "inactive"}>
          {this.state.assemblyProgram[i]}<br/>
        </span>);
    }

    var registerTable = [];
    var register;
    for (i = 0; i < this.state.studentRegisters.usedRegisters.length; i++) {
      register = this.state.studentRegisters.usedRegisters[i];

      var studentValue = `0x${this.state.studentRegisters.read(register).toString(16).toUpperCase()}`;
      var referenceValue = `0x${this.state.referenceRegisters.read(register).toString(16).toUpperCase()}`;

      var color, tooltipContent;
      if (studentValue == referenceValue) {
        color = "#00C851";
        tooltipContent = "Great job! This is correct."
      } else {
        color = "#ff4444";
        tooltipContent = `Sorry, try again! We expected: ${referenceValue}`
      }

      registerTable.push(<tr style={{textAlign: 'center', background: color}} className="source-code">
        <td>{registerToNameMap[register]}</td>
        <td>
          <Tooltip
            placement="top"
            component="a"
            tooltipContent={tooltipContent}>
              {studentValue}
          </Tooltip>
        </td>
      </tr>);
    }

    var registers = Object.keys(nameToRegisterMap);
    for (i = 0; i < registers.length; i++) {
      register = registers[i];
      if (this.state.studentRegisters.usedRegisters.indexOf(register) != -1) {
        continue;
      }

      registerTable.push(<tr style={{textAlign: 'center'}} className="source-code">
          <td>{register}</td>
          <td>0x{this.state.studentRegisters.read(nameToRegisterMap[register]).toString(16).toUpperCase()}</td>
        </tr>);
    }

    var pulsatingInterest =
      <div className="pulsating-dot__ripple">
        <span></span>
        <div></div>
        <div></div>
        <div></div>
      </div>;

    var assemblyExplanation;
    if (this.state.unviewedAssemblyExplanation) {
      assemblyExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is the assembly code you will be testing your program with! Each lesson
          will have a different assembly file targetting the instructions you&aposll be implementing in
          that lesson.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedAssemblyExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      assemblyExplanation = <div></div>
    }

    var stepExplanation;
    if (this.state.unviewedStepExplanation) {
      stepExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is how you&aposll be running your code!
            <ul>
              <li><b>Run</b>: Execute the entire assembly program with your implementation</li>
              <li><b>Step</b>: Execute just the highlighted line with your implementation</li>
              <li><b>Reset</b>: Reset all the register/memory values and bring the execution back to the beginning</li>
            </ul>
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedStepExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i>Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      stepExplanation = <div></div>
    }

    var implementExplanation;
    if (this.state.unviewedImplementExplanation) {
      implementExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is where you&aposll be implementing your code for the lesson! We&aposve provided
          you with a template to get started.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedImplementExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      implementExplanation = <div></div>
    }

    var memoryExplanation;
    if (this.state.unviewedMemoryExplanation) {
      memoryExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is debug corner! You&aposll see all the values of registers and memory in this
          area, which you can use for debugging what&aposs is going on when you run your program.
            <Button outline style={{width:"100%"}}
              onClick={() => this.setState({ unviewedMemoryExplanation : false })}>
              <i className="fa fa-stop" aria-hidden="true"></i> Close Help
            </Button>
          </PopoverBody>
        </Popover>
    } else {
      memoryExplanation = <div></div>
    }

    var lessonsCompleted = [];
    for (i = 1; i < this.state.lessonPart; i++) {
      lessonsCompleted.push(
        <Button outline onClick={() => this.setState({
                      lessonPart : (i-1),
                      loadLesson : true,
                      isPaneOpen: true,
                      showTest: false,
                      showMenu: false
                    })}>
          Lesson {i}
        </Button>)
    }

    return (this.state.selectedLesson ?

      <div>
        <SlidingPane
            isOpen={ this.state.isPaneOpen }
            width='50%'
            onRequestClose={ () => {
              this.setState({ isPaneOpen: false });
            }}>

          <ReactMarkdown source={this.state.lessonContent} />
        </SlidingPane>

        <SlidingPane
            isOpen={ this.state.showMenu }
            width='50%'
            from="left"
            onRequestClose={ () => {
              this.setState({ showMenu: false });
            }}>
            <ModalBody>
              <div className="row">
                <Button outline onClick={() => this.setState({
                  selectedLesson : false,
                  showMenu: false
                })} style={{width:"100%"}}>
                  Return to Title
                </Button>

                <h1>Return to a Previous Lesson</h1>
                {lessonsCompleted}
              </div>
          </ModalBody>
        </SlidingPane>


        <Navbar color="default-color-dark" dark>
          <NavbarBrand href="#">
            <Button outline onClick={() => this.setState({
                  selectedLesson : false,
                  showMenu: false
                })}>
              Main Menu
            </Button>
          </NavbarBrand>
          <Collapse isOpen={true}>
            <NavbarNav>
              <NavItem>
                <Button outline onClick={() => this.setState({ isPaneOpen : true })}>
                  Intro Text
                </Button>
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Navbar>

        <Modal isOpen={this.state.lessonCorrect && this.state.lessonComplete}
          frame position="bottom">

          <ModalHeader>Great Work!</ModalHeader>
          <ModalBody className="text-center">
            <div className="row">
              <div className="col-sm-6">
                <Button outline style={{width:"100%"}}
                    onClick={() => {
                    this.setState({
                      lessonPart : this.state.lessonPart + 1,
                      loadLesson : true,
                      isPaneOpen: true,
                      showTest: false
                    });
                  }}> Next Lesson
                </Button>
              </div>

              <div className="col-sm-6">
                <Button outline color="danger" onClick={() => this.setState({ loadLesson : true })} style={{width:"100%"}}>
                  Redo Lesson
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <div className="row" >
          <div className="col-sm-6" style={{display: "flex"}}>
            <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center">
              <CardHeader color="default-color">
                {implementExplanation}
                <CardTitle componentclassName="h4">
                  Implement
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
                  width="100%"
                  tabSize="2"
                  style={{
                    visible : !this.state.showTest,
                    zIndex: 0,
                    display: "flex"
                  }}
                />
                <br />
                <Dropdown>
                  <DropdownToggle caret outline color="default" style={{width:"100%"}}>
                    {this.state.theme.replace(/_/g," ")}
                  </DropdownToggle>
                  <DropdownMenu  style={{width:"100%"}}>
                    <DropdownItem onClick={() => {this.setState({ theme : "chrome" })}} eventKey="chrome" className={this.state.theme == "chrome" ? "active" : "inactive"}>chrome</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "dracula" })}} eventKey="dracula" className={this.state.theme == "dracula" ? "active" : "inactive"}>dracula</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "eclipse" })}} eventKey="eclipse" className={this.state.theme == "eclipse" ? "active" : "inactive"}>eclipse</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "github" })}} eventKey="github" className={this.state.theme == "github" ? "active" : "inactive"}>github</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "monokai" })}} eventKey="monokai" className={this.state.theme == "monokai" ? "active" : "inactive"}>monokai</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "solarized_dark" })}} eventKey="solarized_dark" className={this.state.theme == "solarized_dark" ? "active" : "inactive"}>solarized (dark)</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "solarized_light" })}} eventKey="solarized_light" className={this.state.theme == "solarized_light" ? "active" : "inactive"}>solarized (light)</DropdownItem>
                    <DropdownItem onClick={() => {this.setState({ theme : "twilight" })}} eventKey="twilight" className={this.state.theme == "twilight" ? "active" : "inactive"}>twilight</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardBody>
            </Card>
          </div>

          <div className="col-sm-6">
            <Card style={{ marginTop: '1rem', width:"100%"}}>
              <CardHeader color="default-color" className="text-center">
                {stepExplanation}
                <CardTitle componentclassName="h4">
                  Testing
                </CardTitle>
              </CardHeader>
              <CardBody>
                {assemblyExplanation}
                <div className="col-sm-12">
                  <div className="col-sm-12">
                    <ul className="shell-body" style={{width:"100%"}}>{ assemblyList }</ul>
                  </div>
                  <div className="col-sm-12">
                    <Button outline style={{width:"100%"}}
                      onClick={() => this.setState({ targetStep : this.state.assemblyProgram.length - 1 })}>
                        <i className="fa fa-play" aria-hidden="true"></i> Run
                    </Button>
                  </div>
                  <div className="col-sm-12">
                    <Button outline style={{width:"100%"}}
                      onClick={() => this.setState({ targetStep : this.state.targetStep + 1 })}>
                        <i className="fa fa-forward" aria-hidden="true"></i> Step
                    </Button>
                  </div>
                  <div className="col-sm-12">
                    <Button outline style={{width:"100%"}}
                      onClick={() => {this.setState({ loadLesson : true })}}>
                      <i className="fa fa-refresh" aria-hidden="true"></i> Reset
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card style={{ marginTop: '1rem', width:"100%"}} className="text-center">
              <CardHeader color="default-color">
                {memoryExplanation}
                <CardTitle componentclassName="h1">
                  CPU & Memory
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
          </div>
        </div>
      </div>

      :

      <div>
        <div className="row">
          <div className="col-sm-6" style={{position: "absolute", top:"25%", left:"25%"}}>
            <Card style={{ marginTop: '1rem'}} className="text-center">
              <CardHeader color="default-color">
                <CardTitle componentclassName="h1">Intertect</CardTitle>
              </CardHeader>
              <CardBody>
                <FadeIn>
                  <Button outline onClick={() => {
                    this.setState({ selectedLesson : true })}} style={{width:"75%"}}>
                    Lesson 1
                  </Button><br />
                  <Button outline disabled style={{width:"75%"}}>Lesson 2</Button><br />
                  <Button outline disabled style={{width:"75%"}}>Lesson 3</Button><br />
                  <Button outline disabled style={{width:"75%"}}>Lesson 4</Button>
                </FadeIn>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Terminal;
