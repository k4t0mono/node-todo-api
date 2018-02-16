// Test for server.js

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');
const { DummyTodo, populateTodos, DummyUser, populateUsers } = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(201)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) { return done(err); }

				Todo.find({ text }).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should not create a new todo with invalid body', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err) { return done(err); }

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();

				}).catch((err) => done(err));
			});
	});

});


describe('GET /todos', () => {
	
	it('Should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2); 
			})
			.end(done);
	});

});


describe('GET /todos/:todoId', () => {
	
	it('Should return todo doc', (done) => {
		request(app)
			.get(`/todos/${DummyTodo[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(DummyTodo[0].text);
			})
			.end(done);
	});

	it('Should return 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('Should return 400 for non-object id', (done) => {
		request(app)
			.get('/todos/123')
			.expect(400)
			.end(done);
	});

});


describe('DELETE /todos/:todoID', () => {
	
	it('Should remove a todo', (done) => {
		var id = DummyTodo[0]._id.toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);

			})
			.end((err, res) => {
				if(err) { return done(err); }

				Todo.findById(id).then((todo) => {
					expect(todo).toNotExist();
					done();
				});
			});
	});

	it('Should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID()}`)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object id is invalid', (done) => {
		request(app)
			.delete('/todos/k4t0')
			.expect(400)
			.end(done);
	});

});


describe('PATCH /todos/:todoID', () => {
	
	it('Should update text the todo', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();
		var text = 'The Spice must flow';

		request(app)
			.patch(`/todos/${todoID}`)
			.send({ text })
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);

			}).end(done);
	});

	it('Should set completedAt when todo is completed', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();

		request(app)
			.patch(`/todos/${todoID}`)
			.send({ completed: true })
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeAn('number');

			}).end(done);
	});

	it('Should clear completedAt when todo is not completed', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();

		request(app)
			.patch(`/todos/${todoID}`)
			.send({ completed: false })
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();

			}).end(done);
	});

	it('Should return 404 if todo not found', (done) => {
		request(app)
			.patch(`/todos/${new ObjectID()}`)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object id is invalid', (done) => {
		request(app)
			.patch('/todos/k4t0')
			.expect(400)
			.end(done);
	});

});
