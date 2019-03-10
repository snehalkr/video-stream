const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const helper = require('./helper')

function logUser(req) {
  console.log(req.connection.remoteAddress);
}

function getPath(req) {
  var path=''
  if (typeof req.query.id !== 'undefined' && req.query.id !== null) {
    path=req.query.id;
  }

  return path;
}

app.use(express.static(path.join(__dirname, 'public')))
const folder = 'C:/Users/User/Downloads'

app.get('/', function(req, res) {
  logUser(req);
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/api', function(req, res) {
  logUser(req);

  var path = getPath(req);

  jsonRespone = helper.getDirListJSON(folder, path);
  res.contentType('application/json');
  res.send(JSON.stringify(jsonRespone));
})

app.get('/no-js', function(req, res) {
  logUser(req);

  var path=getPath(req);

  var out = helper.getDirListHTML(folder, path);
  res.send(out);
})

app.get('/video', function(req, res) {
  logUser(req);
  helper.loadVideo(folder, req, res);
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})