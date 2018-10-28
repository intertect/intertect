/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable import/default */
/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

require('./favicon.ico');
render(<App />, document.getElementById("app"));
