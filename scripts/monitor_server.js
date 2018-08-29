/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

const Vivus = require('vivus');
new Vivus('monitor', {
	start: 'autostart',
	type: 'delayed',
	duration: 150
});