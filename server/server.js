// server.js

var { ObjectID } = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todo.js');
var { User } = require('./models/user.js');

const PORT = process.env.PORT || 3000;
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


app.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});


module.exports = { app };
