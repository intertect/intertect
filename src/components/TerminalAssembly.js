/* eslint-disable import/no-named-as-default */
import React from "react";

class TerminalAssembly extends React.Component {
  render() {
    return (
      <div id="cat_main_s_output" style={{display: 'none'}}>
        <br /> &nbsp;&nbsp;&nbsp;&nbsp;.file&nbsp;&nbsp;&nbsp;{'"main.c"'}
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
    );
  }
}

export default TerminalAssembly;

      