module.exports = (http) => {
	const io = require('socket.io').listen(http);

	io.on('connection', socket => {
		// Socket for a registered user. 
		socket.on('userLoggedIn', (user) => {
			io.emit('announceUser', user);
		});

		// Socket for new messages once a User creates one. 
		socket.on('newMessage', (message) => {
			io.emit('displayNewMessage', (message));
		});

		// Socket for when messages need to be reloaded (deleted a message). 
		socket.on('reloadMessages', () => {
			io.emit('displayMessages');
		});
	});
};