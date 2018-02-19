// Test for server.js

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');
const { User } = require('./../models/user.js');
const { DummyTodo, populateTodos, DummyUser, populateUsers } = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', DummyUser[0].tokens[0].token)
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
			.set('x-auth', DummyUser[0].tokens[0].token)
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
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(1); 
			})
			.end(done);
	});

});


describe('GET /todos/:todoId', () => {
	
	it('Should return todo doc', (done) => {
		request(app)
			.get(`/todos/${DummyTodo[0]._id.toHexString()}`)
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(DummyTodo[0].text);
			})
			.end(done);
	});

	it('Should not return todo doc create by other user', (done) => {
		request(app)
			.get(`/todos/${DummyTodo[1]._id.toHexString()}`)
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 400 for non-object id', (done) => {
		request(app)
			.get('/todos/123')
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(400)
			.end(done);
	});

});


describe('DELETE /todos/:todoID', () => {
	
	it('Should remove a todo', (done) => {
		var id = DummyTodo[1]._id.toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', DummyUser[1].tokens[0].token)
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

	it('Should not remove a todo created for other user', (done) => {
		var id = DummyTodo[0]._id.toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', DummyUser[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if(err) { return done(err); }

				Todo.findById(id).then((todo) => {
					expect(todo).toExist();
					done();
				});
			});
	});

	it('Should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID()}`)
			.set('x-auth', DummyUser[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object id is invalid', (done) => {
		request(app)
			.delete('/todos/k4t0')
			.set('x-auth', DummyUser[1].tokens[0].token)
			.expect(400)
			.end(done);
	});

});


describe('PATCH /todos/:todoID', () => {
	
	it('Should update text of todo', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();
		var text = 'The Spice must flow';

		request(app)
			.patch(`/todos/${todoID}`)
			.set('x-auth', DummyUser[0].tokens[0].token)
			.send({ text })
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);

			}).end(done);
	});

	it('Should not update text of todo created by another user', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();
		var text = 'The Spice must flow';

		request(app)
			.patch(`/todos/${todoID}`)
			.set('x-auth', DummyUser[1].tokens[0].token)
			.send({ text })
			.expect(404)
			.end(done);
	});

	it('Should set completedAt when todo is completed', (done) => {
		var todoID = DummyTodo[0]._id.toHexString();

		request(app)
			.patch(`/todos/${todoID}`)
			.set('x-auth', DummyUser[0].tokens[0].token)
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
			.set('x-auth', DummyUser[0].tokens[0].token)
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
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 400 if object id is invalid', (done) => {
		request(app)
			.patch('/todos/k4t0')
				.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(400)
			.end(done);
	});

});


describe('GET /users/me', () => {

	it('Should return user if authenticated', (done) => {
		var user = DummyUser[0];

		request(app)
			.get('/users/me')
			.set('x-auth', user.tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(user._id.toHexString());
				expect(res.body.email).toBe(user.email);
			})
			.end(done);
	});

	it('Should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done);
	});

});


describe('POST /users', () => {
	
	it('Should create a user', (done) => {
		var email = 'k4t0@terminus.io';
		var password = '123qwe.';

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(201)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err) { done(err); }

				User.findOne({ email }).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((err) => done(err));
			});
	});

	it('Should return validation errors if request is invalid', (done) => {
		request(app)
			.post('/users')
			.send({ email: 'k@t', password: '123' })
			.expect(400)
			.end(done);
	});

	it('Should not create user if in use', (done) => {
		var email = DummyUser[0].email;

		request(app)
			.post('/users')
			.send({ email, password: '12345678' })
			.expect(400)
			.end(done);
	});

});

describe ('POST /users/login', () => {
	
	it('Should login user and return auth token', (done) => {
		var email = DummyUser[1].email;
		var password = DummyUser[1].password;

		request(app)
			.post('/users/login')
			.send({ email, password })
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if(err) { done(err); }
	
				User.findById(DummyUser[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
			 			access: 'auth',
						token: res.headers['x-auth']
					});

					done();
				}).catch((err) => done(err));
			});
	});

	it('Sould reject invalid login', (done) => {
		var email = DummyUser[0].email;
		var password = DummyUser[0].password + '1';

		request(app)
			.post('/users/login')
			.send({ email, password })
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if(err) { done(err); }
	
				User.findById(DummyUser[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((err) => done(err));
			});
	});

});


describe('DELETE /users/me/token', () => {
	it('Should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', DummyUser[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if(err) { done(err); }

				User.findById(DummyUser[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});

});
