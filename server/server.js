// server.js
require('./config/config.js');

const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');

const PORT = process.env.PORT;
var app = express();
app.use(bodyParser.json());


app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});
	
	todo.save().then((doc) => {
		res.status(201).send(doc);

	}, (err) => {
		res.status(400).send(err);
	});
});


app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({ todos });

	}, (err) => {
		res.status(400).send(e);
	});
});


app.get('/todos/:todoID', (req, res) => {
	var todoID = req.params.todoID;
	
	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	Todo.findById(todoID).then((todo) => {
		if(!todo) { return res.status(404).send({}); }

		res.status(200).send({ todo });

	}).catch((e) => res.status(400).send({}));
});


app.delete('/todos/:todoID', (req, res) => {
	var todoID = req.params.todoID;

	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	Todo.findByIdAndRemove(todoID).then((todo) => {
		if(!todo) { return res.status(404).send({}); }

		res.status(200).send({ todo });

	}).catch((e) => res.status(400).send({}));
});


app.patch('/todos/:todoID', (req, res) => {
	var todoID = req.params.todoID;
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(todoID)) { return res.status(400).send({}); }

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = Date.now();

	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	Todo.findByIdAndUpdate(todoID, { $set: body }, { new: true }).then((todo) => {
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


app.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});


module.exports = { app };
