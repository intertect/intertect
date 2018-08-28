/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/
/* eslint-disable no-console */

var app = require('./app')

// set up server-side logging
var bole = require('bole')
bole.output({level: 'debug', stream: process.stdout})
var log = bole('server')
log.info('server process starting')

const PORT = "8080";
const IP = "127.0.0.1";

app.listen(PORT, IP, function (error) {
  if (error) {
    log.error('Unable to listen for connections', error)
    process.exit(10)
  }
  log.info('express is listening on http://' + IP + ':' + PORT)
})