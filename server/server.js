// serever.js

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},

	completed: {
		type: Boolean,
		default: false
	},

	completedAt: {
		type: Date,
		default: Date.now()
	}
});

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

var newUser = new User({ email: 'k4t0mono@terminus.io' });
newUser.save().then((doc) => {
	console.log('Saved user', JSON.stringify(doc, undefined, 2));

}, (err) => {
	console.log('Unable to save user', err);
})

//var newTodo = new Todo({ text: 'Config Void' });

//var newTodo2 = new Todo({ 
	//text: 'Config Arch2',
//});

//newTodo.save().then((doc) => {
//newTodo2.save().then((doc) => {
	//console.log('Saved todo', JSON.stringify(doc, undefined, 2));

//}, (err) => {
	//console.log('Unable to save todo', err);
//});

