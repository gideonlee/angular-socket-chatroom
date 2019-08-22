const express = require('express');
const app = express();
const userRoute = express.Router();

// Models
let User = require('../models/User');
let Message = require('../models/Message');

// Get all Users
userRoute.route('/users').get((req, res) => {
	User.find((err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
});

// Get selected User
userRoute.route('/users/:id').get((req, res) => {
	User.findOne({ '_id': req.params.id }, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
});

// Create User
userRoute.route('/users').post((req, res) => {
	User.create(req.body, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
});

// Edit User
userRoute.route('/users/:id/edit').put((req, res) => {
	User.findOneAndUpdate({ '_id': req.params.id }, { $set: req.body }, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.status(200).json({
				msg: data
			})
		}
	})
});

// Delete User and any Messages they may have posted. 
userRoute.route('/users/:id/delete').delete((req, res) => {
	User.findOneAndDelete({ _id: req.params.id }, (err, data) => {
		Message.deleteMany({ _user: data._id }, (err) => {
			if (err) {
				return handleError(err);
			}
		})

		if (err) {
			return next(err);
		} else {
			res.status(200).json({
				msg: data
			})
		}
	})
});

module.exports = userRoute; 