/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/architecture', function (req, res) {
  res.send('hello world')
})

module.exports = app