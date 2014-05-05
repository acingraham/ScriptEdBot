var http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    spawn = require('child_process').spawn;
    io = require('socket.io');

var codeIsRunning = false,
    formatMessage = function (msg) {
        var formattedMsg = msg;

        if (msg.search(/Device\(s\)/g) !== -1) {
            formattedMsg = 'Detected...';
        } else if (msg.search(/Connected/g) !== -1) {
            formattedMsg = 'Connected...';
        } else if (msg.search(/Repl/g) !== -1) {
            formattedMsg = 'Initialized...';
        }

        return formattedMsg;
    };

var server = http.createServer(function (req, res) {
	var bot,
	    userCode,
	    filepath = __dirname + req.url;

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

				io.sockets.emit('message', {'message': 'Starting the bot...'});
				bot = spawn('node', ['code.js']);

				bot.stdout.on('data', function (data) {
					console.log('stdout: ' + data);
					io.sockets.emit('message', {'message': formatMessage(data.toString())});
				});
				bot.stderr.on('data', function (data) {
					console.log('stderr: ' + data);
					io.sockets.emit('message', {'message': formatMessage(data.toString())});
				});
				bot.on('close', function (statusCode) {
					console.log('ScriptEd Bot stopped with status code ' + statusCode);
					io.sockets.emit('message', {'message': 'ScriptEd Bot stopped with status code ' + statusCode});
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

});

server.listen(8000);
io = io.listen(server);
io.set('log level', 1);
io.sockets.on('connection', function(socket){
    socket.emit('message', {'message': 'Connected to ScriptEd Bot'});
});

console.log('Server running at http://127.0.0.1:8000/');
