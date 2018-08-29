/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

var express = require('express')
var app = express()
var path = require("path");

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/intro', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/intro.html'));
})

app.get('/architecture', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/architecture.html'));
})

app.use("/public", express.static(__dirname + "/public"));
module.exports = app