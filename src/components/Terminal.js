/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */
import React, {Component} from 'react';
import Typist from 'react-typist';
import posed from 'react-pose';

import {Navbar, Nav, Button, Grid, Row, Col, Panel, Table} from 'react-bootstrap';

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

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedCat: false,
      completedLs: false,
      completedAssembly: false,
      completedIntro: false
    }
  }

  render() {
    return (this.state.completedIntro ?
      <div>
        <Navbar>
          <Nav>
            <Grid>
              <Row>
                <Col sm={4}> <Button bsStyle="success">
                  <span className="glyphicon glyphicon-play"></span> Run
                </Button> </Col>
                <Col sm={4}> <Button bsStyle="info">
                  <span className="glyphicon glyphicon-forward"></span> Step
                </Button> </Col>
                <Col sm={4}> <Button bsStyle="danger">
                  <span className="glyphicon glyphicon-stop"></span> Stop
                </Button> </Col>
              </Row>
            </Grid>
          </Nav>
        </Navbar>

        <Grid>
          <Row>
            <Col sm={6}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h4">Code</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <ul className="shell-body" >
                    <span> &nbsp;&nbsp;&nbsp;&nbsp;.file&nbsp;&nbsp;&nbsp;{"main.c"} </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.text </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.globl&nbsp;&nbsp;main </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.type&nbsp;&nbsp;&nbsp;main,&nbsp;@function </span>
                    <span> <br /> main: </span>
                    <span> <br /> .LFB0: </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_startproc </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;pushq&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_offset&nbsp;16 </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_offset&nbsp;6,&nbsp;-16 </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movq&nbsp;&nbsp;&nbsp;&nbsp;%rsp,&nbsp;%rbp </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_register&nbsp;6 </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movl&nbsp;&nbsp;&nbsp;&nbsp;$0,&nbsp;%eax </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;popq&nbsp;&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa&nbsp;7,&nbsp;8 </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;ret </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_endproc </span>
                    <span> <br /> .LFE0: </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.size&nbsp;&nbsp;&nbsp;main,&nbsp;.-main </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.ident&nbsp;&nbsp;{'"GCC:&nbsp;(Ubuntu&nbsp;7.2.0-1ubuntu1~16.04)&nbsp;7.2.0"'} </span>
                    <span> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.section&nbsp;&nbsp;&nbsp;&nbsp;.note.GNU-stack,{'""'},@progbits </span>
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
                  <form role="form">
                    <textarea id="sourceCode"
                          className="form-control source-code"
                          style={{marginBottom: '5px'}}
                          rows="35"></textarea>
                    <Button>Compile</Button>
                  </form>
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

        <TransitionTerminal className="shell-wrap col-sm-6" pose={this.state.completedAssembly ? 'end' : 'start'}>
          <p className="shell-top-bar">/Users/intertect/</p>
          <ul className="shell-body" >
            <li id="cat_main" >
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
