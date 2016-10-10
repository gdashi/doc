#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('src:server');
var fs = require('fs');
var http = require('http');
var https = require('https');
var httpPort = 3005;
var httpsPort = 3006;

try{
  var config = require('wlanpub').config;
  httpPort = config.get('httpPort');
  httpsPort = config.get('httpsPort');
}
catch(e){}

console.log((new Date()) + 'doc server use http/https port ' + httpPort +'/' + httpsPort);

var httpsOptions  = {
    key: fs.readFileSync('./ca/wildcard.rsa'),
    cert: fs.readFileSync('./ca/wildcard.crt')
};

// ---3 启动http server
var server = http.createServer(app);
server.listen(httpPort, function() {
    console.log((new Date()) + ' doc server start http server and listen on: ' + JSON.stringify(server.address()));
});

// ---4 启动https server
var sServer = https.createServer(httpsOptions, app);
sServer.listen(httpsPort, function() {
    console.log((new Date()) + ' doc server start https server and listen on: ' + JSON.stringify(sServer.address()));
});

