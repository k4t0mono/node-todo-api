// mongodb-connect.js

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.error('Unable to connect to MongoDB server');
	}
	
	console.log('Connected to MongoDB Server');

	// db.collection('Todos').deleteMany({text: 'Learn Rust'}).then((result) => {
		// console.log(result);
	// });
	
	// db.collection('Todos').deleteOne({text: 'Learn Rust'}).then((result) => {
		// console.log(result);
	// });
	
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
		// console.log(result);
	// });
	
	//db.collection('Users').deleteMany({name: 'Asoka'}).then((result) => {
		//console.log(result.result);
	//});

	db.collection('Users').findOneAndDelete({
		_id: new ObjectId("5a822ae881b8fb405da7ec3a")
	
	}).then((result) => {
		console.log(result);
	});

	db.close();
});
