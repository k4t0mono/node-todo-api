// mongoose-queries.js

const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose.js');
const { Todo } = require('./../server/models/todo.js');
const { User } = require('./../server/models/user.js');

//var id = 'a84ee769cc0c5221cd2ea28';

//if(!ObjectID.isValid(id)) {
	//console.log('Id not valid');
//}

//Todo.find({ _id: id }).then((todos) => {
	//console.log('Todos: ', JSON.stringify(todos, undefined, 2));
//});

//Todo.findOne({ _id: id }).then((todos) => {
	//console.log('Todo: ', JSON.stringify(todos, undefined, 2));
//});

//Todo.findById(id).then((todo) => {
	//if(!todo) {
		//console.log('Id not found');
		//return;
	//}

	//console.log('Todo by id: ', JSON.stringify(todo, undefined, 2));
//}).catch((err) => console.log(err));

var userId = '5a849bac5ae5f3255ea019cc';

if(ObjectID.isValid(userId)) {
	User.findById(userId).then((user) => {
		if(!user) { 
			console.log('User not found');
			return;
		}

		console.log('User: ', JSON.stringify(user, undefined, 2));
	}).catch((err) => console.log(err));

} else {
	console.log('Id not valid');
}
