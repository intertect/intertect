/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';

import Terminal from './components/Terminal';
require('./favicon.ico');

render(<Terminal />, document.getElementById("terminal"));
