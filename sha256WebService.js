// For printing formatted things
var util = require('util');
// Express to listen to browser requests
var express = require('express');
var app = express();
// Body parser for parsing the request body
var bodyParser = require('body-parser')
// Crypto module for computing sha256 hash
const crypto = require('crypto');
// Debug modules to aid with debugging
var debugModule = require('debug');
var debug = debugModule('sha256-web-service');

//
// Initialize the CouchDB Database for data storage
//

// Get the Docker Host IP from command line as CouchDB is running as a Docker
// container
var DOCKER_HOST_IP = process.argv[2];
var nano = require('nano')('http://' + DOCKER_HOST_IP + ':5984');

// Clean up the database we created previously
var messageDB;
nano.db.destroy('message_db', function() {
  // Create a new database
  nano.db.create('message_db', function() {
	debug("Created message_db database");
    // Specify the database we are going to use
 	messageDB = nano.use('message_db');

	// Start the web service
	 startListener();
  });
});

//
// Configure an HTTP server to listen for incoming requests
//

// Assign a listening port for the HTTP service
var app_port = 3000;

// Enable CORS for ease of development and testing
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Use body-parer to parse the JSON formatted request payload
app.use(bodyParser.json());

//
// Add route for retrieving a message with a given hash
//
app.get("/messages/:hash", function(req, res) {
	debug("ENTER /messages/:hash");

	// Message hash to retrieve
	var hashVar = req.params.hash;
	debug("Requesting hash = " + hashVar);

	messageDB.get(hashVar, function(err, body) {
		if (err) {
			console.log('ERROR: [messageDB.get] ', err.message);
			if (err.message == 'missing') {
				res.status(404).json({ error: "Message not found" });
			} else {
				res.status(500).json({ error: err.message });
			}
	  	} else {
			debug("Retrieved message from messageDB.")
			debug("Retrieved body = " + JSON.stringify(body));

			res.status(200).json({ "message": body.message });
		}
	});
});

//
// Add route for computing a message hash
//
app.post('/messages', function(req, res) {
	debug("ENTER /messages");

	// Message string
	var message = req.body.message;
	debug("message = " + message);

	// Compute the SHA256 hash of the incoming message
	var messageHash = crypto.createHash('sha256').update(message).digest('hex');
	debug("messageHash = " + messageHash);

	// Insert the message and its hash into the database
	messageDB.insert({ _id: messageHash, message: message }, function(err, body, header) {
		if (err) {
			console.log('ERROR: [messageDB.insert] ', err.message);
			res.status(500).json({ error: err.message });
	  	} else {
			debug("Inserted message into messageDB.")
			debug("Inserted body = " + JSON.stringify(body));

			res.status(200).json({ "digest": messageHash });
		}
	});
});

//
// Start the HTTP server to listen for incoming requests
//
function startListener() {
	console.log("Starting sha256WebService on port " + app_port);
	app.listen(app_port);
	console.log("sha256WebService is now listening on port " + app_port + "\n");
}
