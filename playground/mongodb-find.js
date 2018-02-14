// mongodb-connect.js

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.error('Unable to connect to MongoDB server');
	}

	db.collection('Todos').find().count().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		console.log('Unable to fetch todos', err);
	});

	db.collection('Users').find({ name: 'KatoMono Enkeli' }).toArray().then((docs) => {
		console.log('Users:');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		console.log('Unable to fetch users', err);

	});

	console.log('Connected to MongoDB Server');
	
//	db.close();
});
