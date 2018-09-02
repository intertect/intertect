/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/no-named-as-default */
import React, {Component} from 'react';
import Typist from 'react-typist';
import posed from 'react-pose';

import {Navbar, Nav, Button, Grid, Row, Col} from 'react-bootstrap';

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

        <div className="container">
          <div className="row">
            <div className="col-sm-5">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">Code</h4>
                </div>
                <div className="panel-body" style={{background: '#141414'}}>
                  <ul className="shell-body" >
                    <span style={{backgroundColor: '#ffa'}} id="assembly_1"> &nbsp;&nbsp;&nbsp;&nbsp;.file&nbsp;&nbsp;&nbsp;{"main.c"} </span>
                    <span id="assembly_2"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.text </span>
                    <span id="assembly_3"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.globl&nbsp;&nbsp;main </span>
                    <span id="assembly_4"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.type&nbsp;&nbsp;&nbsp;main,&nbsp;@function </span>
                    <span id="assembly_5"> <br /> main: </span>
                    <span id="assembly_6"> <br /> .LFB0: </span>
                    <span id="assembly_7"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_startproc </span>
                    <span id="assembly_8"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;pushq&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span id="assembly_9"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_offset&nbsp;16 </span>
                    <span id="assembly_10"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_offset&nbsp;6,&nbsp;-16 </span>
                    <span id="assembly_11"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movq&nbsp;&nbsp;&nbsp;&nbsp;%rsp,&nbsp;%rbp </span>
                    <span id="assembly_12"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa_register&nbsp;6 </span>
                    <span id="assembly_13"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;movl&nbsp;&nbsp;&nbsp;&nbsp;$0,&nbsp;%eax </span>
                    <span id="assembly_14"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;popq&nbsp;&nbsp;&nbsp;&nbsp;%rbp </span>
                    <span id="assembly_15"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_def_cfa&nbsp;7,&nbsp;8 </span>
                    <span id="assembly_16"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;ret </span>
                    <span id="assembly_17"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.cfi_endproc </span>
                    <span id="assembly_18"> <br /> .LFE0: </span>
                    <span id="assembly_19"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.size&nbsp;&nbsp;&nbsp;main,&nbsp;.-main </span>
                    <span id="assembly_20"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.ident&nbsp;&nbsp;{'"GCC:&nbsp;(Ubuntu&nbsp;7.2.0-1ubuntu1~16.04)&nbsp;7.2.0"'} </span>
                    <span id="assembly_21"> <br /> &nbsp;&nbsp;&nbsp;&nbsp;.section&nbsp;&nbsp;&nbsp;&nbsp;.note.GNU-stack,{'""'},@progbits </span>
                  </ul>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm"></div>
            <div className="col-sm-6">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">Implement</h4>
                </div>
                <form role="form">
                  <textarea id="sourceCode"
                        className="form-control source-code"
                        style={{marginBottom: '5px'}}
                        rows="35"
                        tab-support
                        select-line
                        ng-model="code"></textarea>
                  <button type="button" className="btn btn-default" ng-click="assemble()">Compile</button>
                </form>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">CPU & Memory</h4>
                </div>
                <div className="panel-body">
                  <p className="text-muted">Registers / Flags</p>
                  <table className="table table-condensed table-striped">
                    <thead>
                      <tr>
                        <th style={{textAlign: 'center'}}>A</th>
                        <th style={{textAlign: 'center'}}>B</th>
                        <th style={{textAlign: 'center'}}>C</th>
                        <th style={{textAlign: 'center'}}>D</th>
                        <th style={{textAlign: 'center'}}>IP</th>
                        <th style={{textAlign: 'center'}}>SP</th>
                        <th style={{textAlign: 'center'}}>Z</th>
                        <th style={{textAlign: 'center'}}>C</th>
                        <th style={{textAlign: 'center'}}>F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{textAlign: 'center'}} className="source-code">
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><div style={{margin: 'auto'}} className="marker marker-sp"><small>blah</small></div></td>
                        <td><small>blah</small></td>
                        <td><small>blah</small></td>
                        <td><small>blah</small></td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-muted">RAM</p>
                  <div style={{width: '29em'}} className="source-code">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
