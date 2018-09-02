/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';

import Editor from './components/Editor';
import Terminal from './components/Terminal';
require('./favicon.ico');

render(<Editor />, document.getElementById("editor"));
render(<Terminal />, document.getElementById("terminal"));