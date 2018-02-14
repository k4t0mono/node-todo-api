// serever.js

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
	text: {
		type: String
	},

	completed: {
		type: Boolean
	},

	completedAt: {
		type: Number
	}
});

var newTodo = new Todo({ text: 'Config Void' });

var newTodo2 = new Todo({ 
	text: 'Config Arch',
	completed: true,
	completedAt: Date.now()
});

// newTodo.save().then((doc) => {
newTodo2.save().then((doc) => {
	console.log('Saved todo', doc);

}, (err) => {
	console.log('Unable to save todo', err);
});

