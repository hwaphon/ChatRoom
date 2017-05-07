var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var users = [];

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function( req, res ) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('adduser', function(name) {
		users.push({
			name: name,
			flag: 'item' + users.length
		});

		io.emit('adduser-todom', users);
	});

	socket.on('disconnect', function() {
		var user = users.pop();

		io.emit('user-disconnect', user);
	});

	socket.on('send-message', function(msg) {
		io.emit('send-message-todom', msg);
	});
});

http.listen(process.env.PORT || 5000);