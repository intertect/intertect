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

import {Memory, Registers, nameToRegisterMap} from '../utils/util.js';
import {lessonContent, lessonRegisterInits, lessonAssembly,
  lessonStarterCode, lessonReferenceSolutions, lessonBinaryCode} from '../utils/lessonItems.js';

import MemoryTable from './MemoryTable.js'
import RegistersTable from './RegistersTable.js'

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      targetStep: 0,

      isIntroPaneOpen: true,
      revealCompletedLevels: false,
      confirmRestart: false,
      showMenu: false,

      lesson: null,
      lessonPart: null,
      lessonContent: "",

      completedLessons: localStorage.getItem('completedLessons') || 2,
      completedParts: localStorage.getItem('completedParts') || 1,

      resetCode: localStorage.getItem('studentProgram') == null,
      loadLesson: false,
      lessonComplete: false,
      lessonCorrect: true,

      studentProgram: localStorage.getItem('studentProgram') || "",
      assemblyProgram: [],
      binaryProgram: [],
      memory: new Memory(),

      studentRegisters: new Registers(),
      referenceRegisters: new Registers(),

      showRegisters: true,
      showMemory: false,

      unviewedStepExplanation: true,
      unviewedImplementExplanation: true,
      unviewedMemoryExplanation: true,
      showTest: false,

      theme: "solarized_dark"
    };

    this.onChange = this.onChange.bind(this);
    this.resetCode = this.resetCode.bind(this);
    this.loadLesson = this.loadLesson.bind(this);
    this.saveProgram = this.saveProgram.bind(this);
    this.copyRegisters = this.copyRegisters.bind(this);
  }

  onChange(newValue) {
    this.setState({ studentProgram: newValue});
  }

  saveProgram() {
    localStorage.setItem('studentProgram', this.state.studentProgram);
    localStorage.setItem('completedLessons', this.state.lesson);
    localStorage.setItem('completedParts', this.state.lessonPart);
  }

  resetCode() {
    var lessonPart = `lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
    this.setState({
      resetCode : false,
      studentProgram : lessonStarterCode[lessonPart]
    });
  }

  loadLesson() {
    if (this.state.lessonPart > this.state.completedParts) {
      this.setState({ completedParts : this.state.lessonPart })
      localStorage.setItem('completedParts', this.state.lessonPart);
    }

    if (this.state.lesson > this.state.completedLessons) {
      this.setState({ completedLessons : this.state.lesson })
      localStorage.setItem('completedLessons', this.state.lesson);
    }

    var lessonPart = `lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
    var initRegisters = new Registers();
    var referenceRegisters = new Registers();

    initRegisters.load(lessonRegisterInits[lessonPart]);
    referenceRegisters.load(lessonRegisterInits[lessonPart]);

    // only need the binary code available for lessons 2 and up
    if (this.state.lesson > 1) {
      this.setState({
        binaryProgram : lessonBinaryCode[lessonPart].replace(/\s/g, '').match(/.{1,8}/g),
      })
    }

    this.setState({
      lessonComplete: false,
      lessonCorrect: true,
      currentStep : 0,
      targetStep : 0,

      lessonContent : Object.values(lessonContent[lessonPart]).join(""),
      assemblyProgram : lessonAssembly[lessonPart].split("\n"),
      studentProgram : lessonStarterCode[lessonPart],

      studentRegisters : initRegisters,
      referenceRegisters : referenceRegisters,
      loadLesson : false
    })
  }

  copyRegisters(srcRegisters) {
    var newRegisters = new Registers();
    newRegisters.registers_ = srcRegisters.registers_;
    newRegisters.recentRegister = srcRegisters.recentRegister;
    newRegisters.usedRegisters = srcRegisters.usedRegisters;
    return newRegisters;
  }

  render() {
    if (this.state.targetStep != this.state.studentRegisters.read(nameToRegisterMap["$pc"])) {
      this.setState({ currentStep : this.state.studentRegisters.read(nameToRegisterMap["$pc"])})
    }

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

      // instruction is passed as assembly for lesson 1 and binary for all others
      var instruction;
      if (this.state.lesson == 1) {
        instruction = this.state.assemblyProgram[this.state.currentStep]
          .replace(/,/g,"")
          .split(" ");
      } else {
        instruction = parseInt(this.state.binaryProgram[this.state.currentStep],
          16).toString(2).padStart(32, '0');
      }

      console.log(instruction)

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
        execute(instruction, this.state.studentRegisters);
      } catch(e) {
        // student renamed function -- no execution
      }

      var lessonPart = `lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
      var solution = lessonReferenceSolutions[lessonPart];
      solution(instruction, this.state.referenceRegisters);

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
    var lessonMenuButtons = [];

    var lessons = Array.range(1, 5)
    var lessonParts = Array.range(1, this.state.completedParts + 1)
    lessons.map((lesson) => {
      lessonMenuButtons.push(
        <Button outline onClick={() => {
            this.setState({
              lesson : lesson,
              lessonPart : 1,
              loadLesson : true
            })
          }}
          className={(lesson <= this.state.completedLessons) ? "enabled" : "disabled"}
          style={{width:"75%"}}>

          Lesson {lesson}
        </Button>)

      if (lesson <= this.state.completedLessons) {
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
      }
    )

    var currentInstruction;
    this.state.lesson > 1 ?
      currentInstruction = <div>
        Current Instruction: {this.state.binaryProgram[this.state.currentStep]}
      </div>
      : currentInstruction = <div></div>

    return (this.state.lesson ?

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
                  lesson : null,
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
                    {currentInstruction}
                    <ul className="shell-body" style={{width:"100%"}}>{ assemblyList }</ul>
                  </div>
                  <div className="col-sm-12">
                    <Button outline color="success" style={{width:"100%"}}
                      onClick={() => {
                        var newStudentRegisters = this.copyRegisters(this.state.studentRegisters);
                        var newReferenceRegisters  = this.copyRegisters(this.state.referenceRegisters);

                        newStudentRegisters.registers_[nameToRegisterMap["$pc"]] = this.state.assemblyProgram.length - 1;
                        newReferenceRegisters.registers_[nameToRegisterMap["$pc"]]  = this.state.assemblyProgram.length - 1;

                        this.setState({
                          targetStep : this.state.assemblyProgram.length - 1,
                          studentRegisters : newStudentRegisters,
                          referenceRegisters : newReferenceRegisters
                        })
                      }}>
                      <i className="fa fa-play" aria-hidden="true"></i> Run
                    </Button>
                  </div>
                  <div className="col-sm-12">
                    <Button outline color="default" style={{width:"100%"}}
                      onClick={() => {
                        var newStudentRegisters = this.copyRegisters(this.state.studentRegisters);
                        var newReferenceRegisters  = this.copyRegisters(this.state.referenceRegisters);

                        newStudentRegisters.registers_[nameToRegisterMap["$pc"]] += 1;
                        newReferenceRegisters.registers_[nameToRegisterMap["$pc"]] += 1;

                        this.setState({
                          targetStep : this.state.targetStep + 1,
                          studentRegisters : newStudentRegisters,
                          referenceRegisters : newReferenceRegisters
                        })
                      }}>
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
                <FadeIn> {lessonMenuButtons} </FadeIn>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Terminal;
