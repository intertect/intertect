/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/default */
/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';

import Terminal from './components/Terminal';
const rust = import("./utils/mips");

require('./favicon.ico');

rust.then(result => {
  console.log('Return value was ', result.compile_string("add $t2, $t0, $t1"))
  render(<Terminal />, document.getElementById("terminal"));
})
