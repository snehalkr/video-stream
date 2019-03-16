const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

function getDirList(folder, path) {
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

exports.getDirListJSON = function(folder, path) {
	result = getDirList(folder, path);
	curDir = folder + '' + path;
	jsonRespone = {cur:path,files:result};
	return jsonRespone;
}


exports.getDirListHTML = function(folder, path) {
	var out = '';

	result = getDirList(folder, path);
	result.forEach(function(curItem) {
		link = path + '/' + curItem.link;
		if(curItem.type==0)
			out+='<a href="/no-js?id='+link+'">' + curItem.link + '</a> : Folder</br>\n';
		else
			out+='<a href="/video?id='+link+'">' + curItem.link + '</a> : File</br>\n';
	})
	return out;
}

exports.loadVideo = function(folder, req, res) {
	var path = folder+''+req.query.id;

	if (!fs.existsSync(path)) {
		res.send('Video Not Found!');
		return ;
	}

	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range

	var id = req.query.id;

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
}

exports.loadConfig = function(config) {
	var ret;
	data = fs.readFileSync(config);
	ret=JSON.parse(data);
	return ret;
}
// console.log(this.getDirList('C:/unity/nodejs/video-stream-sample'));