/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/default */
/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';
import Terminal from './components/Terminal';
import ModalPage from './components/ModalPage';

require('./favicon.ico');
render(<Terminal />, document.getElementById("terminal"));
