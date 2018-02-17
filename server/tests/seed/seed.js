// Dummy database

const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo.js');
const { User } = require('./../../models/user.js');

var user0ID = new ObjectID();
var user1ID = new ObjectID();
const DummyUser = [
	{
		_id: user0ID,
		email: 'email0@example.com',
		password: 'somepass',
		tokens: [
			{
				access: 'auth',
				token: jwt.sign({ _id: user0ID, access: 'auth' }, 'abc123').toString()
			}
		]
	},
	{
		_id: user1ID,
		email: 'email1@example.com',
		password: 'somepass2'
	}
];

const DummyTodo = [
	{ 
		_id: new ObjectID(),
		text: 'Dummy todo 1'
	},
	{ 
		_id: new ObjectID(),
		text: 'Nobody expects the Spanish Inquisition',
		completed: true,
		completedAt: 1518704665
	}
];


const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(DummyTodo);
	}).then(() => done());
};


const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userZero = new User(DummyUser[0]).save();
		var userOne = new User(DummyUser[1]).save();

		return Promise.all([userZero, userOne]);

	}).then(() => done());
};

module.exports = {
	DummyTodo,
	populateTodos,
	DummyUser,
	populateUsers
}
