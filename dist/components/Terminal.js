/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import { Button, Card, CardBody, CardTitle, CardHeader,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Popover, PopoverHeader, PopoverBody,
  Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem,
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

import {Memory, Registers} from '../utils/util.js';
import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

var lesson_1_part_1 = require('../references/lesson_1/part_1.js');
var lesson_1_part_2 = require('../references/lesson_1/part_2.js');
var lesson_1_part_3 = require('../references/lesson_1/part_3.js');
var lesson_1_part_4 = require('../references/lesson_1/part_4.js');
var lesson_1_part_5 = require('../references/lesson_1/part_5.js');

const solutionsToFunctions = {
  "lesson_1/part_1" : lesson_1_part_1.solution,
  "lesson_1/part_2" : lesson_1_part_2.solution,
  "lesson_1/part_3" : lesson_1_part_3.solution,
  "lesson_1/part_4" : lesson_1_part_4.solution,
  "lesson_1/part_5" : lesson_1_part_5.solution,
};

Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLesson: false,
      theme: "solarized_dark",

      currentStep: 0,
      targetStep: 0,

      isIntroPaneOpen: true,
      isGlossaryPaneOpen: false,
      revealCompletedLevels: false,
      confirmRestart: false,
      showMenu: false,
      completedInstructions: false,

      lesson: parseInt(localStorage.getItem('lesson') || "1"),
      lessonPart: parseInt(localStorage.getItem('lessonPart') || "1"),
      lessonGlossary: "",
      glossaryItem: "",
      lessonContent: "",
      lessonTitle: "Starting Slowly",
      resetCode: localStorage.getItem('studentProgram') == null,
      loadLesson: true,
      lessonComplete: false,
      lessonCorrect: true,

      completedLessons: 1,
      completedParts: 1,

      studentProgram: localStorage.getItem('studentProgram') || "",
      assemblyProgram: [],
      memory: new Memory(),

      studentRegisters: new Registers(),
      referenceRegisters: new Registers(),
      targetRegisters: new Registers(),

      showRegisters: true,
      showMemory: false,

      unviewedStepExplanation: true,
      unviewedImplementExplanation: true,
      unviewedMemoryExplanation: true,
      showTest: false
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetCode = this.resetCode.bind(this);
    this.loadLesson = this.loadLesson.bind(this);
    this.saveProgram = this.saveProgram.bind(this);
  }

  handleSelect(evt) {
    this.setState({ theme: evt });
  }

  onChange(newValue) {
    this.setState({ studentProgram: newValue});
  }

  saveProgram() {
    localStorage.setItem('studentProgram', this.state.studentProgram);
    localStorage.setItem('lesson', this.state.lesson);
    localStorage.setItem('lessonPart', this.state.lessonPart);
  }

  resetCode() {
    var starterCode = `../starter/lesson_${this.state.lesson}/part_${this.state.lessonPart}.js`;
    fetch(starterCode)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ studentProgram : text });
    });

    this.setState({ resetCode : false });
  }

  loadLesson() {
    if (this.state.lessonPart > this.state.completedParts) {
      this.setState({ completedParts : this.state.lessonPart })
    }

    if (this.state.lesson > this.state.completedLessons) {
      this.setState({ completedLessons : this.state.lesson })
    }

    this.setState({
      lessonComplete: false,
      lessonCorrect: true,
      currentStep : 0,
      targetStep : 0
    });

    var initRegisters, referenceRegisters, targetRegisters;
    var lessonContentFile = `../content/lesson_${this.state.lesson}/part_${this.state.lessonPart}.md`;
    fetch(lessonContentFile)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ lessonContent : text });
    });

    var lessonGlossaryFile = `../content/lesson_${this.state.lesson}/introduction.md`;
    fetch(lessonGlossaryFile)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ lessonGlossary : text });
    });

    var lessonDir = `../lesson_programs/lesson_${this.state.lesson}/part_${this.state.lessonPart}/`;
    fetch(lessonDir + "prog.s")
    .then((r)  => r.text())
    .then(text => {
      this.setState({ assemblyProgram : text.split("\n") });
    });

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
    });

    fetch(lessonDir + "final.txt")
    .then((r)  => r.text())
    .then(text => {
      targetRegisters = new Registers();
      targetRegisters.load(text);
      this.setState({ targetRegisters : targetRegisters });
    });

    this.setState({ loadLesson : false });
  }

  render() {
    if (this.state.loadLesson) {
      this.loadLesson();
    }

    if (this.state.resetCode) {
      this.resetCode();
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

      try {
        // eslint-disable-next-line
        execute(assemblyInstruction, this.state.studentRegisters);
      } catch(e) {
        // student renamed function -- no execution
      }

      var lessonPart = `lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
      var solution = solutionsToFunctions[lessonPart];
      solution(assemblyInstruction, this.state.referenceRegisters);

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

    var pulsatingInterest =
      <div className="pulsating-dot__ripple">
        <span></span>
        <div></div>
        <div></div>
        <div></div>
      </div>;

    var stepExplanation;
    if (this.state.unviewedStepExplanation) {
      stepExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is how you{"'"}ll be running your code!
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
        </Popover>;
    } else {
      stepExplanation = <div></div>;
    }

    var implementExplanation;
    if (this.state.unviewedImplementExplanation) {
      implementExplanation =
        <Popover placement="right" component="a" popoverBody={pulsatingInterest}>
          <PopoverHeader></PopoverHeader>
          <PopoverBody>This is where you{"'"}ll be implementing your code for the lesson! We{"'"}ve provided
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

    var completedLessons = [];

    var lessons = Array.range(1, this.state.completedLessons + 1)
    var lessonParts = Array.range(1, this.state.completedParts + 1)
    lessons.map((lesson) => {
      completedLessons.push(<ListGroupItem active>Level {lesson}</ListGroupItem>);
      lessonParts.map((part) => {
        completedLessons.push(
          <ListGroupItem>
            <div className="row align-middle">
              <div className="col-sm-3">Part {part}</div>
              <div className="col-sm-9">
                <Button outline onClick={() => {
                    this.setState({
                      lessonPart : part,
                      loadLesson : true,
                      resetCode : true,
                      isIntroPaneOpen: true,
                      showTest: false,
                      revealCompletedLevels: false
                    });
                  }} style={{width:"100%"}}>
                  Redo
                </Button>
              </div>
            </div>
          </ListGroupItem>)
        });
      }
    )

    return (this.state.selectedLesson ?

      <div>
        <SlidingPane
            isOpen={ this.state.isIntroPaneOpen }
            width='50%'
            onRequestClose={ () => {
              this.setState({ isIntroPaneOpen: false });
            }}>

          <ReactMarkdown source={this.state.lessonContent} escapeHtml={false} />
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
                <Button outline onClick={() => this.setState({ revealCompletedLevels : true })}>
                  Previous Levels
                </Button>

                <Button outline onClick={() => this.setState({ isIntroPaneOpen : true })}>
                  Intro Text
                </Button>
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Navbar>

        <Modal isOpen={this.state.revealCompletedLevels} centered>
          <ModalHeader>Completed Levels</ModalHeader>
          <ModalBody>
            <ListGroup> {completedLessons} </ListGroup>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-sm-12">
                <Button outline onClick={() => this.setState({revealCompletedLevels : false})} style={{width:"100%"}}>
                  Close
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>


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
                      resetCode : true,
                      isIntroPaneOpen: true,
                      showTest: false
                    });
                  }}> Next Lesson
                </Button>
              </div>

              <div className="col-sm-6">
                <Button outline color="danger" onClick={() => this.setState({ loadLesson : true })} style={{width:"100%"}}>
                  I Want To Stay Here
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={!this.state.lessonCorrect && this.state.lessonComplete}
          frame position="bottom">

          <ModalHeader>Oops, let{"'"}s try again!</ModalHeader>
          <ModalBody className="text-center">
            <div className="row">
              <div className="col-sm-6">
                <Button outline style={{width:"100%"}}
                    onClick={() => {this.setState({ loadLesson : true })}}>
                  <i className="fa fa-refresh" aria-hidden="true"></i> Reset
                </Button>
              </div>

              <div className="col-sm-6">
                <Button outline color="danger" style={{width:"100%"}}
                    onClick={() => {this.setState({ confirmRestart : true })}}>
                  <i className="fa fa-warning" aria-hidden="true"></i> Restart Level
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.confirmRestart} centered>
          <ModalHeader>Restart Level</ModalHeader>
          <ModalBody>
            <b>Warning: </b> You will lose <b>all</b> your progress by hitting Continue. Please make sure
            this is what you want before clicking Continue
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-sm-6">
                <Button outline onClick={() => this.setState({confirmRestart : false})} style={{width:"100%"}}>
                  Close
                </Button>
              </div>

              <div className="col-sm-6">
                <Button outline color="danger" style={{width:"100%"}}
                  onClick={() => {this.setState({
                    loadLesson : true,
                    resetCode: true,
                    confirmRestart : false })}}>
                  Continue
                </Button>
              </div>
            </div>
          </ModalFooter>
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
                <br />
                <div className="row">
                  <div className="col-sm-6">
                    <Button outline style={{width:"100%"}}
                        onClick={() => this.saveProgram()}>
                      <i className="fa fa-save" aria-hidden="true"></i> Save Progress
                    </Button>
                  </div>

                  <div className="col-sm-6">
                    <Button outline color="danger" style={{width:"100%"}}
                        onClick={() => {this.setState({ confirmRestart : true })}}>
                      <i className="fa fa-warning" aria-hidden="true"></i> Restart Level
                    </Button>
                  </div>
                </div>
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
                <div className="col-sm-12">
                  <div className="col-sm-12">
                    <ul className="shell-body" style={{width:"100%"}}>{ assemblyList }</ul>
                  </div>
                  <div className="col-sm-12">
                    <Button outline color="success" style={{width:"100%"}}
                      onClick={() => this.setState({ targetStep : this.state.assemblyProgram.length - 1 })}>
                        <i className="fa fa-play" aria-hidden="true"></i> Run
                    </Button>
                  </div>
                  <div className="col-sm-12">
                    <Button outline color="default" style={{width:"100%"}}
                      onClick={() => this.setState({ targetStep : this.state.targetStep + 1 })}>
                        <i className="fa fa-forward" aria-hidden="true"></i> Step
                    </Button>
                  </div>
                  <div className="col-sm-12">
                    <Button outline color="warning" style={{width:"100%"}}
                      onClick={() => {this.setState({ loadLesson : true })}}>
                      <i className="fa fa-refresh" aria-hidden="true"></i> Reset
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card style={{ marginTop: '1rem', width:"100%"}}>
              <CardHeader color="default-color" className="text-center">
                {memoryExplanation}
                <CardTitle componentclassName="h4">
                  Debugging
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-sm-6">
                    <Button outline
                      onClick={() => this.setState({ showRegisters : !this.state.showRegisters })} style={{width:"100%"}}>
                      {this.state.showRegisters ? "Hide" : "Show" } CPU (Registers)
                    </Button>

                    <Collapse isOpen={this.state.showRegisters}>
                      <RegistersTable
                        studentRegisters={this.state.studentRegisters}
                        referenceRegisters={this.state.referenceRegisters}
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
                        memory={this.state.memory}
                      />
                    </Collapse>
                  </div>
                </div>
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
