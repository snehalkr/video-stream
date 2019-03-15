const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express();
// var cookieParser = require('cookie-parser');
var session = require('express-session');
const helper = require('./helper')
var folders = ['C:/Users/User/Downloads', 'C:/unity']
const folder = 'C:/Users/User/Downloads'


function logUser(req) {
	console.log('[' + Date() + '] ' + req.connection.remoteAddress + ': ' + req.url);
}

function getRoot(req) {
	if(req.session.root == 1) {
		return folders[1];
	}
	return folders[0];
}

function getPath(req) {
	var path=''
	if (typeof req.query.id !== 'undefined' && req.query.id !== null) {
		path=req.query.id;
	}

	return path;
}

function parseString(str) {
	var key ='';
	var val = '';
	var st  = 0;
	var obj = {};
	for(c of str) {
		if(st==0) {
			if(c=='=')
				st=1;
			else
				key += c;
		} else if(st==1) {
			if(c=='&') {
				obj[key]=val;
				key='';
				val='';
				st=0;
			} else 
				val+=c;
		}
	}

	obj[key]=val;

	return obj;
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res, next) {
	logUser(req);
	next();
})
// app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}))


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.htm'));
})

app.get('/api', function(req, res) {
	jsonRespone = helper.getDirListJSON(getRoot(req), getPath(req));
	res.contentType('application/json');
	res.send(JSON.stringify(jsonRespone));
})

app.get('/no-js', function(req, res) {
	var out = helper.getDirListHTML(getRoot(req), getPath(path));
	res.send(out);
})

app.get('/video', function(req, res) {
	helper.loadVideo(getRoot(folder), req, res);
})

app.get('/select-root', function(req, res) {
	res.sendFile(path.join(__dirname + '/select-root.htm'));
})

app.post('/select-root', function(req, res) {
	var str = '';

	req.on('data', function(data) {
		str+=data;
	}).on('end', function() {
		var r = parseString(str);
		var out;
		if(r['pwd'] == 'MyPassword') {
			if(r['root']=='0'||r['root']=='1') {
				out = 'Success';
				req.session.root = r['root'];
				res.redirect('/');
			} else {
				out = 'Invalid Selection';
				res.send(out);
			}
		} else {
			out = 'Invalid Password';
			res.send(out);
		}
	});
})

app.listen(3000, function () {
	console.log('Listening on port 3000!')
})