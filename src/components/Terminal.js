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

import 'brace/mode/javascript';

import 'brace/theme/chrome';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/twilight';

import '../styles/intro.css';

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

function onChange(newValue) {
  console.log('change',newValue);
}

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
      assemblyStep: 1,
      theme: "monokai",
      program: ""
    }

    fetch('../utils/starter.js')
    .then((r)  => r.text())
    .then(text => {
      this.setState({ program: text });
    })

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(evt) {
    this.setState({ theme: evt });
  }

  render() {
    return (this.state.completedIntro ?

      <div>
        <Navbar>
          <Nav>
            <Grid>
              <NavItem>
                <Row>
                  <Col sm={4}> <Button bsStyle="success" style={{width:"100%"}}>
                    <span className="glyphicon glyphicon-play"></span> Run
                  </Button> </Col>
                  <Col sm={4}> <Button bsStyle="info" style={{width:"100%"}}
                  onClick={() =>
                    this.setState({ assemblyStep: this.state.assemblyStep + 1 })
                  }>
                    <span className="glyphicon glyphicon-forward"></span> Step
                  </Button> </Col>
                  <Col sm={4}> <Button bsStyle="danger" style={{width:"100%"}}>
                    <span className="glyphicon glyphicon-stop"></span> Stop
                  </Button> </Col>
                </Row>
              </NavItem>
            </Grid>
          </Nav>
        </Navbar>

        <Navbar fixedBottom>
          <p>&copy; 2018 Yash Patel and Peter DeLong. All rights reserved.</p>
          <h1></h1>
        </Navbar>

        <Grid>
          <Row>
            <Col sm={6}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">Instructions</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <div className="shell-wrap">
                    <ul className="shell-body">
                      <Typist>
                      <Typist.Delay ms={500} />

                      <li>Hey there!</li>
                      <li>
                        In this lesson, we gonna learn about computer <LinkWithTooltip tooltip={
                        <span> INCREASED <strong>KNOWLEDGE</strong> </span>} href="#" id="tooltip-2"> architecture </LinkWithTooltip>
                      </li>

                      </Typist>
                    </ul>
                  </div>
                </Panel.Body>
              </Panel>

              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">Code</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <ul className="shell-body" >
                    <span className={this.state.assemblyStep == 1 ? "active" : "inactive"}> &nbsp;&nbsp;&nbsp;&nbsp;.file&nbsp;&nbsp;&nbsp;{"main.c"} </span>
                    <span className={this.state.assemblyStep == 2 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.text </span>
                    <span className={this.state.assemblyStep == 3 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.globl&nbsp;&nbsp;main </span>
                    <span className={this.state.assemblyStep == 4 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.type&nbsp;&nbsp;&nbsp;main,&nbsp;@function </span>
                    <span className={this.state.assemblyStep == 5 ? "active" : "inactive"}> <br /> main: </span>
                    <span className={this.state.assemblyStep == 6 ? "active" : "inactive"}> <br /> .LFB0: </span>
                    <span className={this.state.assemblyStep == 7 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_startproc </span>
                    <span className={this.state.assemblyStep == 8 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;pushq&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span className={this.state.assemblyStep == 9 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_offset&nbsp;16 </span>
                    <span className={this.state.assemblyStep == 10 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_offset&nbsp;6,&nbsp;-16 </span>
                    <span className={this.state.assemblyStep == 11 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movq&nbsp;&nbsp;&nbsp;&nbsp;%rsp,&nbsp;%rbp </span>
                    <span className={this.state.assemblyStep == 12 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_register&nbsp;6 </span>
                    <span className={this.state.assemblyStep == 13 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movl&nbsp;&nbsp;&nbsp;&nbsp;$0,&nbsp;%eax </span>
                    <span className={this.state.assemblyStep == 14 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;popq&nbsp;&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span className={this.state.assemblyStep == 15 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa&nbsp;7,&nbsp;8 </span>
                    <span className={this.state.assemblyStep == 16 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;ret </span>
                    <span className={this.state.assemblyStep == 17 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_endproc </span>
                    <span className={this.state.assemblyStep == 18 ? "active" : "inactive"}> <br /> .LFE0: </span>
                    <span className={this.state.assemblyStep == 19 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.size&nbsp;&nbsp;&nbsp;main,&nbsp;.-main </span>
                    <span className={this.state.assemblyStep == 20 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.ident&nbsp;&nbsp;{'"GCC:&nbsp;(Ubuntu&nbsp;7.2.0-1ubuntu1~16.04)&nbsp;7.2.0"'} </span>
                    <span className={this.state.assemblyStep == 21 ? "active" : "inactive"}> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.section&nbsp;&nbsp;&nbsp;&nbsp;.note.GNU-stack,{'""'},@progbits </span>
                  </ul>
                </Panel.Body>
              </Panel>
            </Col>

            <Col sm={6}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">Implement</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
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

                  <AceEditor
                    mode="javascript"
                    theme={this.state.theme}
                    onChange={onChange}
                    name="UNIQUE_ID"
                    editorProps={{$blockScrolling: true}}
                    defaultValue={this.state.program}
                  />
                </Panel.Body>
              </Panel>

              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">CPU & Memory</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <Table condensed striped>
                    <thead>
                      <tr>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>IP</th>
                        <th>SP</th>
                        <th>Z</th>
                        <th>C</th>
                        <th>F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td><div><small>blah</small></div></td>
                        <td><div><small>blah</small></div></td>
                        <td><div><small>blah</small></div></td>
                        <td><div><small>blah</small></div></td>
                        <td><div><small>blah</small></div></td>
                        <td><div><small>blah</small></div></td>
                        <td><small>blah</small></td>
                        <td><small>blah</small></td>
                        <td><small>blah</small></td>
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
        <Navbar></Navbar>

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
                &nbsp;&nbsp;&nbsp;&nbsp;.file&nbsp;&nbsp;&nbsp;{'"main.c"'}
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.text
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.globl&nbsp;&nbsp;main
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.type&nbsp;&nbsp;&nbsp;main,&nbsp;@function
                <br /> main:
                <br /> .LFB0:
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_startproc
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;pushq&nbsp;&nbsp;&nbsp;%rbp
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_offset&nbsp;16
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_offset&nbsp;6,&nbsp;-16
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;movq&nbsp;&nbsp;&nbsp;&nbsp;%rsp,&nbsp;%rbp
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_register&nbsp;6
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;movl&nbsp;&nbsp;&nbsp;&nbsp;$0,&nbsp;%eax
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;popq&nbsp;&nbsp;&nbsp;&nbsp;%rbp
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa&nbsp;7,&nbsp;8
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;ret
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_endproc
                <br /> .LFE0:
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.size&nbsp;&nbsp;&nbsp;main,&nbsp;.-main
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.ident&nbsp;&nbsp;{'"GCC: (Ubuntu 7.2.0-1ubuntu1~16.04) 7.2.0"'}
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;.section&nbsp;&nbsp;&nbsp;&nbsp;.note.GNU-stack,{'""'},@progbits

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
