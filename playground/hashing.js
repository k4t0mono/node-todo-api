// Hashing

const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = 'pass123';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(pass, salt, (err, hash) => {
		// console.log(hash);
	});
});

var hashed = '$2a$10$CMb4SeJDPmpPMaglGwop/Ojp8ROjPSQNAlrXS9kiUtagmsHhETrXe';

bcrypt.compare(pass, hashed, (err, res) => {
	console.log(res);
});

//var data = {
	//id: 10
//};

//var token = jwt.sign(data, 'liber_null');
//console.log(token);
//var decoded = jwt.verify(token, 'liber_null');
//console.log(decoded);

//var msg = 'The spice must flow'
//var hash = SHA256(msg).toString();

//console.log(`Message: ${msg}`);
//console.log(`Hash: ${hash}`);

//var data = {
	//id: 4
//}

//var token = {
	//data,
	//hash: SHA256(JSON.stringify(data)).toString()
//}

//console.log(token);
