// Hashing

const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
	id: 10
};

var token = jwt.sign(data, 'liber_null');
console.log(token);
var decoded = jwt.verify(token, 'liber_null');
console.log(decoded);

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
