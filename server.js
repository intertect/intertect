/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/
/* eslint-disable no-console */

const connect = require('connect');
const serveStatic = require('serve-static');

const PORT = process.env.PORT !== undefined ? process.env.PORT : 8080;

connect().use(serveStatic(`${__dirname}/public/`)).listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
