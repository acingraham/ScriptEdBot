var http = require('http'),
	fs = require('fs'),
	mime = require('mime');

http.createServer(function (req, res) {
	var filepath = __dirname + req.url;

	console.log(filepath);

	fs.readFile(filepath, function(err, data) {
		if(err) {
			res.writeHead(400, {'Content-Type': 'text/plain'});
			res.end('File not found');
		} else {
			res.writeHead(200, {'Content-Type': mime.lookup(filepath)});
			res.end(data);
		}
	});

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
