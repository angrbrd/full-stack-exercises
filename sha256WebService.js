// For printing formatted things
var util = require('util');
// Express to listen to browser requests
var express = require('express');
var app = express();
// Body parser for parsing the request body
var bodyParser = require('body-parser')
// Debug modules to aid with debugging
var debugModule = require('debug');
var debug = debugModule('sha256-web-service');

//
// Initialize the CouchDB Database for data storage
//



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




	res.status(200).json({ "message": "anya" });

	// res.status(500).json({ error: errorMsg });
});

//
// Add route for computing a message hash
//
app.post('/messages', function(req, res) {
	debug("ENTER /messages");

	// Message string
	var message = req.body.message;
	debug("Message = " + message);




	res.status(200).json({ "digest": "anyaHASH" });

	// res.status(500).json({ error: errorMsg });
});

//
// Start the HTTP server to listen for incoming requests
//
function startListener() {
	console.log("Starting sha256WebService on port " + app_port);
	app.listen(app_port);
	console.log("sha256WebService is now listening on port " + app_port + "\n");
}

//
// Start the service
//
 startListener();
