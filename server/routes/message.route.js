const express = require('express');
const app = express();
const messageRoute = express.Router();

// Message model
let Message = require('../models/Message');
let User = require('../models/User'); 

// Finds all the messages.
messageRoute.route('/messages').get((req, res) => {
	Message.find().populate('_user').exec((err, allMessagesWithUsers) => {
		if (err) {
			res.json(err);
		} else {
			res.json(allMessagesWithUsers);
		}
	})
});

// Create a Message.
messageRoute.route('/messages').post((req, res) => {
	User.findOne({'email': req.body.email}, (err, selectedUser) => {
		Message.create({ 'text': req.body.text, '_user': selectedUser._id }, (err, data) => {
			if (err) {
				return next(err);
			} else {
				selectedUser.messages.push(data);
				selectedUser.save()
				res.json(data);
			}
		})
	})
});

// Deletes a message and removes it from the corresponding subcollection messages from the User.messages array. 
messageRoute.route('/messages/:id/delete').delete((req, res) => {
	Message.findOneAndDelete({ _id: req.params.id }, (err, data) => {
		User.findOne({ _id: data._user }, (err, user) => {
			if (err) {
				return next(err);
			} else {
				user.messages.splice(user.messages.indexOf(data._id), 1);
				user.save();				
			}
		})

		if (err) {
			return next(err);
		} else {
			res.status(200).json({
				msg: data,
			})
		}
	})
});

module.exports = messageRoute;