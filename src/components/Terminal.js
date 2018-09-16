/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */

import React, {Component} from 'react';
import {Navbar, Nav, NavItem, Button, Grid, Row, Col,
  Panel, Table, DropdownButton, MenuItem, Tooltip, OverlayTrigger} from 'react-bootstrap';
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

import '../styles/intro.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';

const Box = posed.div({
  hoverable: true,
  draggable: 'x',
  dragBounds: { left: '-100%', right: '100%' },
  init: { scale: 1 },
  hover: { scale: 1.2 },
  drag: { scale: 1.1 }
})

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
      completedCat: false,
      completedLs: false,
      completedAssembly: false,
      completedIntro: false,
      assemblyStep: 0,
      theme: "monokai",

      isPaneOpen: true,
      completedInstructions: false,

      lesson: 1,
      lessonPart: 0,

      lessonCorrect: false,

      studentProgram: "",
      assemblyProgram: "",
      memory: new Memory(),
      registers: new Registers(),
      targetRegisters: new Registers()
    }

    this.loadLesson();
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
    this.state.lessonCorrect = false;
    this.state.lessonPart += 1;
    this.state.assemblyStep = 0;

    var starterCode = `../starter/lesson_${this.state.lesson}-${this.state.lessonPart}.js`;
    fetch(starterCode)
    .then((r)  => r.text())
    .then(text => {
      this.setState({ studentProgram: text });
    })

    var lessonDir = `../lesson_programs/lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
    fetch(lessonDir + "/prog.s")
    .then((r)  => r.text())
    .then(text => {
      this.setState({ assemblyProgram: text.split("\n") });
    })

    fetch(lessonDir + "/init.txt")
    .then((r)  => r.text())
    .then(text => {
      this.state.registers.load(text);
    })

    fetch(lessonDir + "/final.txt")
    .then((r)  => r.text())
    .then(text => {
      this.state.targetRegisters.load(text);
    })
  }

  render() {
    let continuationButton;
    if (this.state.lessonCorrect) {
      continuationButton =
        <Button bsStyle="success" style={{width:"100%"}}
          onClick={() => {
            this.setState({
              isPaneOpen: true
            });
            this.loadLesson();
          }}> Next Lesson
        </Button>
    } else {
      continuationButton =
        <Button bsStyle="warning" style={{width:"100%"}}
          onClick={() => {
            this.setState({  assemblyStep: 0 });
            var lessonDir = `../lesson_programs/lesson_${this.state.lesson}/part_${this.state.lessonPart}`;
            fetch(lessonDir + "/init.txt")
            .then((r)  => r.text())
            .then(text => {
              this.state.registers.load(text);
            })
          }}> Reset
        </Button>
    }

    var assemblyList = [];
    for (var i = 0; i < this.state.assemblyProgram.length; i++) {
      assemblyList.push(
        <span className={this.state.assemblyStep == i ? "active" : "inactive"}>
          {this.state.assemblyProgram[i]}<br/>
        </span>);
    }

    return (this.state.completedIntro ?

      <div>
        <Navbar fixedBottom>
          <p>&copy; 2018 Yash Patel and Peter DeLong. All rights reserved.</p>
          <h1></h1>
        </Navbar>

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
                  In this lesson, we gonna learn about computer <LinkWithTooltip tooltip={
                  <span> INCREASED <strong>KNOWLEDGE</strong> </span>} href="#" id="tooltip-2"> architecture </LinkWithTooltip>
                </li>

                </Typist>
              </ul>
            </div><br />
        </SlidingPane>

        <Grid>
          <Row>
            <Col sm={6}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">
                    Implement&nbsp;
                    <DropdownButton onSelect={this.handleSelect} title={this.state.theme}>
                      <MenuItem eventKey="chrome" className={this.state.theme == "chrome" ? "active" : "inactive"}>chrome</MenuItem>
                      <MenuItem eventKey="dracula" className={this.state.theme == "dracula" ? "active" : "inactive"}>dracula</MenuItem>
                      <MenuItem eventKey="eclipse" className={this.state.theme == "eclipse" ? "active" : "inactive"}>eclipse</MenuItem>
                      <MenuItem eventKey="github" className={this.state.theme == "github" ? "active" : "inactive"}>github</MenuItem>
                      <MenuItem eventKey="monokai" className={this.state.theme == "monokai" ? "active" : "inactive"}>monokai</MenuItem>
                      <MenuItem eventKey="solarized_dark" className={this.state.theme == "solarized_dark" ? "active" : "inactive"}>solarized_dark</MenuItem>
                      <MenuItem eventKey="solarized_light" className={this.state.theme == "solarized_light" ? "active" : "inactive"}>solarized_light</MenuItem>
                      <MenuItem eventKey="twilight" className={this.state.theme == "twilight" ? "active" : "inactive"}>twilight</MenuItem>
                    </DropdownButton>
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <AceEditor
                    mode="javascript"
                    theme={this.state.theme}
                    onChange={this.onChange}
                    name="UNIQUE_ID"
                    editorProps={{$blockScrolling: true}}
                    value={this.state.studentProgram}
                    style="{{width:50%}}"
                  />

                  <br />
                  <Col sm={12}>
                    { continuationButton }
                  </Col>
                </Panel.Body>
              </Panel>
            </Col>

            <Col sm={6}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">Code</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <ul className="shell-body" >{ assemblyList }</ul>
                  <br />
                  <Row>
                    <Col sm={4}> <Button bsStyle="success" style={{width:"100%"}}>
                      <span className="glyphicon glyphicon-play"></span> Run
                    </Button> </Col>
                    <Col sm={4}> <Button bsStyle="info" style={{width:"100%"}}
                    onClick={() => {
                      this.setState({ assemblyStep: this.state.assemblyStep + 1 });

                      var script = document.createElement('script');
                      try {
                        script.appendChild(document.createTextNode(this.state.studentProgram));
                        document.body.appendChild(script);
                      } catch (e) {
                        script.text = this.state.studentProgram;
                        document.body.appendChild(script);
                      }

                      execute(this.state.assemblyProgram[this.state.assemblyStep]
                        .replace(/,/g,"")
                        .split(" "),
                        this.state.registers)

                      if (this.state.assemblyStep == (this.state.assemblyProgram.length - 2)) {
                        this.setState({
                          lessonCorrect: this.state.registers.compareRegisters(this.state.targetRegisters)
                        });
                      }
                    }}>
                      <span className="glyphicon glyphicon-forward"></span> Step
                    </Button> </Col>
                    <Col sm={4}> <Button bsStyle="danger" style={{width:"100%"}}>
                      <span className="glyphicon glyphicon-stop"></span> Stop
                    </Button> </Col>
                  </Row>
                </Panel.Body>
              </Panel>

              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">CPU & Memory</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <Table condensed striped>
                    <thead>
                      <th style={{textAlign: 'center'}}>Register</th>
                      <th style={{textAlign: 'center'}}>Value</th>
                    </thead>
                    <tbody>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td><Box></Box></td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$zero"])}</small></div></td>
                      </tr>

                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>Zero</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$zero"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>At</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$at"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>V0</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$v0"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>V1</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$v1"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>A0</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$a0"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>A1</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$a1"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>A2</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$a2"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>A3</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$a3"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T0</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t0"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T1</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t1"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T2</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t2"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T3</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t3"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T4</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t4"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T5</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t5"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T6</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t6"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T7</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t7"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S0</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s0"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S1</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s1"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S2</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s2"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S3</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s3"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S4</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s4"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S5</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s5"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S6</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s6"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>S7</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$s7"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T8</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t8"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>T9</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$t9"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>K0</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$k0"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>K1</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$k1"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>Gp</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$gp"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>Sp</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$sp"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>Fp</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$fp"])}</small></div></td>
                      </tr>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td>Ra</td>
                        <td><div><small>{this.state.registers.read(nameToRegisterMap["$ra"])}</small></div></td>
                      </tr>
                    </tbody>
                  </Table>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>

      :

      <div>
        <Navbar fixedBottom>
          <p>&copy; 2018 Yash Patel and Peter DeLong. All rights reserved.</p>
        </Navbar>

        <TransitionTerminal className="shell-wrap col-sm-6" pose={this.state.completedAssembly ? 'end' : 'start'}>
          <p className="shell-top-bar">/Users/intertect/</p>
          <ul className="shell-body" >
            <li>
              <Typist cursor={{
                hideWhenDone: true,
                hideWhenDoneDelay: 200
              }} onTypingDone={() => {
                this.setState({
                  completedCat: true
                })
              }}>
              <Typist.Delay ms={500} />
                cat main.c
              </Typist>
            </li>

            { this.state.completedCat?
              <div>
                {'#include <stdio.h>'}
                <br />{'int main() {'}
                <br />&nbsp;&nbsp;&nbsp;&nbsp;{'printf("Hello, World!");'}
                <br />&nbsp;&nbsp;&nbsp;&nbsp;{'return 0;'}
                <br />{'}'}
                <br />
                <li>
                  <Typist cursor={{
                    hideWhenDone: true,
                    hideWhenDoneDelay: 200
                  }} onTypingDone={() => {
                    this.setState({
                      completedLs: true
                    })
                  }}>
                  <Typist.Delay ms={500} />
                    ls
                  </Typist>
                </li>
              </div>

              :

              <div></div>
            }

            { this.state.completedLs?
              <div>
                main.c main.s
                <br />
                <li>
                  <Typist cursor={{
                    hideWhenDone: true,
                    hideWhenDoneDelay: 200
                  }} onTypingDone={() => {
                    this.setState({
                      completedAssembly: true
                    })
                  }}>
                    <Typist.Delay ms={500} />
                    cat main.s
                  </Typist>
                </li>
              </div>

              :

              <div></div>
            }

            { this.state.completedAssembly?
              <div>
                {this.state.assemblyProgram}

                <li>
                  <Typist cursor={{
                    hideWhenDone: true,
                    hideWhenDoneDelay: 200
                  }} onTypingDone={() => {
                    this.setState({
                      completedIntro: true
                    })
                  }}>
                    <Typist.Delay ms={2500} />
                    clear
                  </Typist>
                </li>
              </div>

              :

              <div></div>
            }
          </ul>
        </TransitionTerminal>
      </div>
    );
  }
}

export default Terminal;
