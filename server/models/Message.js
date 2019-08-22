const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	text: {
		type: String,
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Message', Message);