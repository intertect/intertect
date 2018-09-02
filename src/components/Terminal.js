/* eslint-disable import/no-named-as-default */
import React, {Component} from 'react';
import Typist from 'react-typist';

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedCat: false,
      completedLs: false,
      completedIntro: false
    }
  }

  render() {
    return (
      <div className="shell-wrap col-sm-6" id="shell" style={{left: "25%"}}>
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
                <Typist.Delay ms={1000} />
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
                    completedIntro: true
                  })
                }}>
                  <Typist.Delay ms={1500} />
                  cat main.s
                </Typist>
              </li>
            </div>

            :

            <div></div>
          }

          { this.state.completedIntro?
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
              <br /> &nbsp;&nbsp;&nbsp;&nbsp;.ident&nbsp;&nbsp;{'"GCC:&nbsp;(Ubuntu&nbsp;7.2.0-1ubuntu1~16.04)&nbsp;7.2.0"'}
              <br /> &nbsp;&nbsp;&nbsp;&nbsp;.section&nbsp;&nbsp;&nbsp;&nbsp;.note.GNU-stack,{'""'},@progbits
            </div>

            :

            <div></div>
          }
        </ul>
      </div>
    );
  }
}

export default Terminal;
