var http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    spawn = require('child_process').spawn;

var codeIsRunning = false;
http.createServer(function (req, res) {
	var filepath = __dirname + req.url,
	    bot,
	    userCode;

	console.log(filepath);

	if (req.method === 'POST') {

		// FIXME - Use proper locking instead of boolean codeIsRunning
		if (codeIsRunning) {
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end('Code is currently running');
		} else {
			codeIsRunning = true;
			userCode = '';
			req.on('data', function (data) {
				userCode += data;
			});

			req.on('end', function () {
				fs.writeFileSync('code.js', userCode);

				bot = spawn('node', ['code.js']);

				bot.stdout.on('data', function (data) {
					console.log('stdout: ' + data);
				});
				bot.stderr.on('data', function (data) {
					console.log('stderr: ' + data);
				});
				bot.on('close', function (statusCode) {
					console.log('bot stopped with status code ' + statusCode);
					codeIsRunning = false;
					res.end();
				});
			});
		}

	} else {
		fs.readFile(filepath, function(err, data) {
			if(err) {
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end('File not found');
			} else {
				res.writeHead(200, {'Content-Type': mime.lookup(filepath)});
				res.end(data);
			}
		});
	}

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
