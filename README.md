# Node.js Coding Exercises

## Overview

This repository contains several coding exercises implemented in Node.js.

1. [SHA256 Web Service](#sha256-web-service)
2. [UTXO Pairs](#utxo-pairs)
3. [Binary Strings](#binary-strings)

## SHA256 Web Service

This web service has two endpoints:

* POST /messages

	This endpoint takes in a message string and returns the SHA256 hash digest of that message in hexadecimal format.
	
* GET /messages/\<hash>

	This endpoint takes the given `<hash>` and returns the original message. A request to a non-existent `<hash>` returns a 404 `Message not found` error.

### Set Up The Database

The database used for this excercise is [Apache CouchDB](http://couchdb.apache.org/). To quickly set up a database instance on your local machine, pull in the CouchDB Docker image from [Docker hub](https://hub.docker.com/_/couchdb/). Alternatively, download and install it from [here](http://couchdb.apache.org/).

	docker pull couchdb

If you are using the CouchDB Docker image, start up the database instance and expose the default port 5984 on the host.

	docker run -d -p 5984:5984 --name my-couchdb couchdb

Insure that the Docker container running CouchDB is up.

	docker ps

You will see output similar to the one below:

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
33caf5a80fca        couchdb             "tini -- /docker-entr"   47 hours ago        Up 47 hours         0.0.0.0:5984->5984/tcp   my-couchdb
```

Insure that CouchDB instance is up and ready for requests.

	curl DOCKER_HOST_IP:5984/

As the default `DOCKER_HOST_IP` on Mac is `192.168.99.100`, the request becomes:

	curl 192.168.99.100:5984/

If the database is up and running, you will receive the following response:

	{
		"couchdb": "Welcome",
		"uuid": "01b6d4481b7ff9e6e067d90c6d20aa83",
		"version": "1.6.1",
		"vendor": {
			"name": "The Apache Software Foundation",
			"version":"1.6.1"
		}
	}

### Run The Application

First, clone this repository and install the required packages.

	cd <working_directory>
	git clone git@github.com:angrbrd/full-stack-exercises.git
	cd full-stack-exercises
	npm install

Then, run the application with Node.js passing the `DOCKER_HOST_IP` on the command line:

	node sha256WebService.js DOCKER_HOST_IP

As the default `DOCKER_HOST_IP` on Mac is `192.168.99.100`, the command becomes:

	node sha256WebService.js 192.168.99.100

### Test The Application

Use *curl* or *Chrome Postman* to send the following sample requests.

**Example #1: String 'apples'**

Request:

	curl -X POST -H "Content-Type: application/json" -d '{"message": "apples"}' 127.0.0.1:3000/messages

Response:

	{"digest":"f5903f51e341a783e69ffc2d9b335048716f5f040a782a2764cd4e728b0f74d9"}

Request:

	curl 127.0.0.1:3000/messages/f5903f51e341a783e69ffc2d9b335048716f5f040a782a2764cd4e728b0f74d9

Response:

	{"message":"apples"}

**Example #2: String 'oranges'**

Request:
	
	curl -X POST -H "Content-Type: application/json" -d '{"message": "oranges"}' 127.0.0.1:3000/messages
	
Response:

	{"digest":"0c7aae56ebe5d422f7f0f5b97da9856b135de81ac462c9c1a85ee53850fec479"}

Request:

	curl 127.0.0.1:3000/messages/0c7aae56ebe5d422f7f0f5b97da9856b135de81ac462c9c1a85ee53850fec479
	
Response:

	{"message":"oranges"}
	
**Example #3: String 'pears'**	

Request:
	
	curl -X POST -H "Content-Type: application/json" -d '{"message": "pears"}' 127.0.0.1:3000/messages
	
Response:

	{"digest":"ed086a3a203062f8a0aab95598b961c62dd637bfb15df906830060e1c604bae5"}
	
Request:

	curl 127.0.0.1:3000/messages/ed086a3a203062f8a0aab95598b961c62dd637bfb15df906830060e1c604bae5
	
Response:

	{"message":"pears"}
	
**Example #4: String 'bannanasHash'**	
	
Request:

	curl 127.0.0.1:3000/messages/bannanasHash

Response:

	{"error":"Message not found"}

**Example #5: String 'watermellonHash'**	
Request:

	curl 127.0.0.1:3000/messages/watermellonHash

Response:

	{"error":"Message not found"}

## UTXO Pairs

XXX ADD HERE XXX

## Binary Strings

XXX ADD HERE XXX
