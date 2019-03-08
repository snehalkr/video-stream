const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const helper = require('./helper')

function logUser(req) {
  console.log(req.connection.remoteAddress);
}

app.use(express.static(path.join(__dirname, 'public')))
const folder = 'C:/Users/User/Downloads'

app.get('/', function(req, res) {
  logUser(req);
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/api', function(req, res) {
  logUser(req);

  var path=''
  if (typeof req.query.id !== 'undefined' && req.query.id !== null) {
    path=req.query.id;
  }
  result = helper.getDirList(folder, path);
  curDir = folder + '' + path;
  jsonRespone = {cur:path,files:result}
  console.log(result);
  res.contentType('application/json');
  res.send(JSON.stringify(jsonRespone));
})

app.get('/no-js', function(req, res) {
  logUser(req);

  var path=''
  if (typeof req.query.id !== 'undefined' && req.query.id !== null) {
    path=req.query.id;
  }
  result = helper.getDirList(folder, path);
  
  var out = '';
  result.forEach(function(curItem) {
    if(curItem.type==0)
      out+='<a href="/no-js?id='+link+'">'+file+'</a> : Folder</br>\n';
    else
      out+='<a href="/video?id='+link+'">'+file+'</a> : File</br>\n';
  })

  res.send(out);
})

app.get('/video', function(req, res) {
  logUser(req);
  var path = folder+''+req.query.id;

  if (!fs.existsSync(path)) {
    res.send('Video Not Found!');
    return ;
  }

  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  var id = req.query.id;
  console.log(id)

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})