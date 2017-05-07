$(function() {
	var localusers = [];

	$('#adduserform').submit(function() {
		var name = $('#name').val();
		$('name').val('');

	 	var socket = io();
	 	socket.on('adduser-todom', function(users) {
	 		users.forEach(function( value, index ) {
	 			if (!~localusers.indexOf(value.name)) {
	 				addUser(value.name, value.flag);
	 			}
	 		});
	 	});

	 	socket.on('user-disconnect', function(user) {
	 		removeUser(user.name, user.flag);
	 	});

		socket.emit('adduser', name);

		$('.model').addClass('hidden');

		socket.on('send-message-todom', function(msg) {
			sendMessage(msg);
		});

		$('#sendmessage').on('click', function(event) {
			event.preventDefault();

			var message = $('#message').val();
			$('#message').val('');

			socket.emit('send-message', {name: name, message: message});
		});

		return false;
	});


	function addUser(name, flag) {
		localusers.push(name);
		$('.user-list').append($('<div></div>').addClass('user ' + flag)
												.html('<img src="imgs/default.jpg" alt="user img">' + 
													'<p class="username">' + name + '</p>'));
	}

	function removeUser(name, flag) {
		var index = localusers.indexOf(name);
		localusers.splice(index, 1);
		$('.' + flag).remove();
	}

	function sendMessage(msg) {
		$('.content-area').append($('<div></div>').addClass('info').html('<p class="author">' + msg.name +
				'</p><div class="message">' + msg.message + '</div>'));
	}
});