/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';

import Editor from './components/Editor';
import TerminalAssembly from './components/TerminalAssembly';
import TerminalCat from './components/TerminalCat';
import TerminalLs from './components/TerminalLs';
require('./favicon.ico');

render(<Editor />, document.getElementById("editor"));
render(<TerminalAssembly />, document.getElementById("terminalAssembly"));
render(<TerminalCat />, document.getElementById("terminalCat"));
render(<TerminalLs />, document.getElementById("terminalLs"));