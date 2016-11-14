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

The problem posed is to find eactly two distinct UTXOs in an input file that add up to or exceed a given target. If no two UTXOs add up to at least the value of the target, the string "Not possible" is returned.

It is assumed that the input file contains a previously sorted list of UTXO values as shown below.

```
	abcdef 17
	e478ab 20
	a84739 23
	a8561m 41
	ken451 57
	krnq44 69
	ktna45 73
	ttwken 87
	rn4514 99
	e4738a 137
	fff483 141

```

The program first checks whether the sum of the two largest values in the input file adds up to the target or exceeds the target. The two largest values are the last two values in the input file, as the input list is sorted. If the sum of the last two values is below the target, the program immediately returns "Not possible" and exists.

Once it is determined that there exist two values that add up to or exceed the target, the list is searched inward to identify the pair of values that is closest to the target value.

### Run The Application

First, clone this repository.

	cd <working_directory>
	git clone git@github.com:angrbrd/full-stack-exercises.git
	cd full-stack-exercises
	npm install
	
Then, run the application with the following command:

	node findUtxoPair.js <input_data_file> <target_value>

The `<input_data_file>` must contain a list of non-decreasing positive integer values and the `<target_value>` must be an integer. An example command is below:

	node findUtxoPair.js test/utxos1.txt 25
	
Running the program on the [utxos1.txt](test/utxos1.txt) input file produces the following output:

```
node findUtxoPair.js test/utxos1.txt 200
Best UTXO pair found: 
krnq44 69, e4738a 137
```

## Binary Strings

The problem posed is to print all possible binary strings starting from a binary input containing 0s, 1s, and Xs. Each of the Xs could represent either a 0 or a 1. For example, an input of `10X10X0` would produce the output of:
	1001000	1001010	1011000	1011010
	
In this solution, the problem is solved through recursion. Each sucessive character in the string is checked for being either a 0, a 1, or an X. If the character seen is either a 0 or a 1, it is simply added to the string being built and the remainder of the string is passed to the recursive algorithm. If the character is an X, it is first replaced with a 0 and then replaced with a 1 before the remainer of the characters continue to be processed.

### Run The Application

First, clone this repository.

	cd <working_directory>
	git clone git@github.com:angrbrd/full-stack-exercises.git
	cd full-stack-exercises
	npm install
	
Then, run the application with the following command:

	node binaryStrings.js <input_string>

`<input_string>` must contain only 1s, 0s, and Xs. An example is below:

	node binaryStrings.js XXX101X
	
The input string `XXX101X` produces the following output:

	0001010
	0001011
	0011010
	0011011
	0101010
	0101011
	0111010
	0111011
	1001010
	1001011
	1011010
	1011011
	1101010
	1101011
	1111010
	1111011

Given that for every X within the input string we get two additional variations, i.e. if that particular X would be replaced by either a 0 or a 1, then the number of possibilities increases as `2^X` or exponentially with `X`.