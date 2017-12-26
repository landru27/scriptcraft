const express = require('express');
const parse = require('body-parser');

module.exports = function(app){

  // set .html as the default template extension
  app.set('view engine', 'html');

  // initialize the ejs template engine
  app.engine('html', require('ejs').renderFile);

  // tell express where it can find the templates
  app.set('views', __dirname + '/views');

  // make the files in the public folder available to the world
  app.use(express.static(__dirname + '/public'));

  // enable parsing of POST body
  //app.use(parse.json({extended: true}));
  app.use(parse.urlencoded({extended: true}));

};
