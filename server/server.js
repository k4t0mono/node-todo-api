// server.js
require('./config/config.js');

const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');
const { authenticate } = require('./middlewere/authenticate.js');

const PORT = process.env.PORT;
var app = express();
app.use(bodyParser.json());


app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_user: req.user._id
	});
	
	todo.save().then((doc) => {
		res.status(201).send(doc);

	}, (err) => {
		res.status(400).send(err);
	});
});


app.get('/todos', authenticate, (req, res) => {
	Todo.find({ _user: req.user._id }).then((todos) => {
		res.send({ todos });

	}, (err) => {
		res.status(400).send(e);
	});
});


app.get('/todos/:todoID', authenticate, (req, res) => {
	var todoID = req.params.todoID;
	
	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	Todo.findOne({ _id: todoID, _user: req.user._id }).then((todo) => {
		if(!todo) { return res.status(404).send({}); }

		res.status(200).send({ todo });

	}).catch((e) => res.status(400).send({}));
});


app.delete('/todos/:todoID', authenticate, (req, res) => {
	var todoID = req.params.todoID;

	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	Todo.findOneAndRemove({ _id: todoID, _user: req.user._id }).then((todo) => {
		if(!todo) { return res.status(404).send({}); }

		res.status(200).send({ todo });

	}).catch((e) => res.status(400).send({}));
});


app.patch('/todos/:todoID', authenticate, (req, res) => {
	var todoID = req.params.todoID;
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = Date.now();

	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	Todo.findOneAndUpdate(
		{ _id: todoID, _user: req.user._id },
		{ $set: body },
		{ new: true }

	).then((todo) => {
		if(!todo) { return res.status(404).send(); }

		res.send({ todo });

	}).catch((e) => res.status(400).send());

});


app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var newUser = new User(body);

	newUser.save().then(() => {
		return newUser.generateAuthToken();

	}).then((token) => {
		res
			.header('x-auth', token)
			.status(201)
			.send(newUser);

	}).catch((e) => res.status(400).send(e));
});


app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).status(200).send(user);
		})

	}).catch((e) => {
		res.status(400).send();
	});
});


app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(400).send();
	});
});

app.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});


module.exports = { app };
