const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

exports.sendErrorMessage = function() {
  return ;
}

exports.getDirList = function(folder, path) {
  var arr=[];
  fullPath = folder + '' + path;

  if (!fs.existsSync(fullPath)) {
    return arr;
  }

  fs.readdirSync(fullPath).forEach(file => {
    var path_string = fullPath+'/'+file;
    var link = file;
    var type;
    if(fs.lstatSync(path_string).isDirectory())
      type = 0;
    else
      type = 1;
    var element = {link:link, type:type};
    arr.push(element);
  });
  return arr;
}

// console.log(this.getDirList('C:/unity/nodejs/video-stream-sample'));