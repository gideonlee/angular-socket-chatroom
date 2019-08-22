let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true }).then(()=> {
	console.log(`Database ChatRoomDB successfully connected.`);
}, error => {
	console.log(`Database could not be connected: ${error}`);
})

// Setting up port with ExpressJS
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/angular-socket-chatroom')));
app.use('/', express.static(path.join(__dirname, 'dist/angular-socket-chatroom')));

// Server side Routes
const userRoute = require('../server/routes/user.route');
app.use('/api', userRoute);

const messageRoute = require('../server/routes/message.route');
app.use('/api', messageRoute);

// Create Port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
	console.log(`App connected to port ${port}.`);
});

// Socket.io and Port
const http = require('http').Server(app);
const io = require('./sockets/io.js')(http);

http.listen(4444, () => {
	console.log('Socket listening on port 4444.');
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
	console.error(err.message);
	// If err has no specified error code, set error code to 'Internal Server Error (500)'
	if (!err.statusCode) {
		err.statusCode = 500;
	}
	res.status(err.statusCode).send(err.message);
})
