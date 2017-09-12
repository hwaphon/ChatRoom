var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var uuid = require('uuid');

var users = [];

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function( req, res ) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

	var thisName;

	socket.on('adduser', function(name) {
		thisName = name;
		users.push({
			name: name,
			flag: uuid.v1()
		});
		io.emit('adduser-todom', users);
	});

	socket.on('disconnect', function() {

		var thisUser;
		users = users.filter(function(user, index) {
			if (user.name === thisName) {
				thisUser = user;
				return false;
			} else {
				return true;
			}
		});

		io.emit('user-disconnect', thisUser);
	});

	socket.on('send-message', function(msg) {
		io.emit('send-message-todom', msg);
	});
});

http.listen(process.env.PORT || 5000);
