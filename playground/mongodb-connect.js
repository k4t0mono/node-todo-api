// mongodb-connect.js

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.error('Unable to connect to MongoDB server');
	}

	console.log('Connected to MongoDB Server');
	
	db.collection('Users').insertOne({
		name: 'KatoMono Enkeli',
		age: 19,
		location: 'Lavras, MG, Brazil'

	}, (err, result) => {
		if(err) {
			return console.log('Unable to inserte todo');
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	db.close();
});
