// main

var fs = require('fs');
var http = require('http');
var express = require('express');

var app = express();
var port = 26656;
var options = {};

app.listen(port, function() {
  console.log('server up and running at port %s', port);
});


require('./config')(app);
require('./routes')(app);

