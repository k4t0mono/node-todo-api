// mongoose-queries.js

const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose.js');
const { Todo } = require('./../server/models/todo.js');
const { User } = require('./../server/models/user.js');

//Todo.remove({}).then((res) => {
	//console.log(res);
//});

var id = '5a8584e66d98e56834c7092b';

Todo.findByIdAndRemove(id).then((res) => {
	console.log(res);
});
