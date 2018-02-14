// mongodb-connect.js

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.error('Unable to connect to MongoDB server');
	}
	
	//console.log('Connected to MongoDB Server');

	//db.collection('Todos').findOneAndUpdate({
		//_id: new ObjectID('5a847ba3cf60b4914155c42f')

	//}, { $set: { completed: true } }, { returnOriginal: false }).then((result) => {
		//console.log(result);
	//});
	
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5a822ae881b8fb405da7ec3a')

	}, { 
		$set: { nick: 'k4t0mono' },
		$inc: { age: 1  }
	
	}, { returnOriginal: false }).then((result) => {
		console.log(result);
	});

	db.close();
});
