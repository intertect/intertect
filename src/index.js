/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/default */
/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';

import Terminal from './components/Terminal';
const mips = import("./utils/mips");
const mipsAssembly = import("./utils/mips_disassembler");

require('./favicon.ico');

mips.then(mipsResult => {
  mipsAssembly.then(mipsAssemblyResult => {
    console.log('Return value was ', mipsResult.compile_string("add $t2, $t0, $t1"));
    var instruction = mipsAssemblyResult.bytesToInstruction([1, 9, 80, 32]);
    console.log(instruction);
    console.log(mipsAssemblyResult.disassembleInstruction(instruction));
    render(<Terminal />, document.getElementById("terminal"));
  })
})
