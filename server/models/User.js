const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema({
	name: { 
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message'
		}
	]
}, { timestamps: true })

module.exports = mongoose.model('User', User);