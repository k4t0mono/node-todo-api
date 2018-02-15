// Test for server.js

const expect = require('expect');
const request = require('supertest');

var { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');

const DummyTodo = [
	{ text: 'Dummy todo 1' },
	{ text: 'Nobody expects the Spanish Inquisition' }
];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(DummyTodo);
	}).then(() => done());
});

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

