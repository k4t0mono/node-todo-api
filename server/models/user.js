// User model

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});


UserSchema.methods.toJSON = function() {
	var userObj = this.toObject();

	return _.pick(userObj, ['_id', 'email']);
}


UserSchema.methods.generateAuthToken = function() {
	var access = 'auth';
	var token = jwt.sign({ _id: this._id.toHexString(), access }, 'terminus').toString();
	this.tokens = this.tokens.concat([{ access, token }]);

	return this.save().then(() => {
		return token;	
	});
}

var User = mongoose.model('User', UserSchema);

module.exports = { User };
