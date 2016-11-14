var fs = require('fs');
var rl = require('readline');
// Debug modules to aid with debugging
var debugModule = require('debug');
var debug = debugModule('find-utxo-pair');

// Read in the name of the data file
var file = process.argv[2];
debug("Data file = " + file);

// Read in the target value
var target = process.argv[3];
debug("Target value = " + target);

// Initialize a stream reader
var reader = rl.createInterface({
	input: fs.createReadStream(file)
});

// The array holding the input data. The data will be formatted as follows:
// [{utxo: utxo_1, value: value_1}, {utxo: utxo_2, value: value_2}, ...]
var data = [];
// The variable holding the two best UTXO pairs that add up to or exceed the target
var bestPair = [];

// For every new line, split at ' ' and insert into data array.
reader.on('line', function (line) {
	// Split the line at every ' '
	var line = line.split(' ');
	// Parse the number as int and push into data array
	data.push({utxo: line[0], value: parseInt(line[1], 10)});
});

// Readline emits a close event when the file is done being read.
reader.on('close', function() {
	var dataLength = data.length;
	debug("Data Length = " + dataLength);

	// This is here for debugging only. Printing a large file is a bad idea :-].
	// debug(data);

	// The last two elements in the array are the largest, as the input array is
	// already sorted. Check to see if the last two elements add up to or exceed
	// the target. If not, return "Not possible".
	if ( (data[dataLength-1].value + data[dataLength-2].value) < target ) {
		console.log("Not possible!");
		process.exit(0);
	}
	// There are two values in the list that add up to or exceed the target.
	// We will traverse the list inward from both sides to find these values.
	var indexLow = 0;
	var indexHigh = dataLength - 1;

	// Continue searching through the list until the indexes flip
	while (indexLow < indexHigh) {
		debug("data[indexLow].value = " + data[indexLow].value + ", data[indexHigh].value = " + data[indexHigh].value);
		debug("current sum = " + (data[indexLow].value + data[indexHigh].value));

		// Two values sum up to the target value exactly
		if(data[indexLow].value + data[indexHigh].value == target) {
			console.log("Exact UTXO pair found: \n" +
						data[indexLow].utxo + " " + data[indexLow].value + ", " +
						data[indexHigh].utxo + " " + data[indexHigh].value);
			process.exit(0);
		}
		// The sum of two values is below the target, increase lower value
		else if (data[indexLow].value + data[indexHigh].value < target) {
			debug("below target...");
			indexLow = indexLow + 1;
		}
		// The sum of two values exceeds the target, decrease higher value
		else {
			debug("above target...");
			// Record these two values in the bestPair variable
			if (bestPair.length != 0) {
				debug("bestPair already exists: " + bestPair[0].value + ", " + bestPair[1].value);

				// If the current pair gets you closer to the target, replace the
				// existing pair with the one just found
				var bestSum = bestPair[0].value + bestPair[1].value;
				var curSum = data[indexLow].value + data[indexHigh].value;
				if (curSum < bestSum) {
					debug("replacing best pair with: " + data[indexLow].value + ", " + data[indexHigh].value);

					// If you have a previously saved best pair, remove it
					bestPair.pop();
					bestPair.pop();

					// Record the current UTXO best pair
					bestPair.push(data[indexLow]);
					bestPair.push(data[indexHigh]);
				}
			} else {
				debug("adding bestPair: " + data[indexLow].value + ", " + data[indexHigh].value);

				// Record the current pair
				bestPair.push(data[indexLow]);
				bestPair.push(data[indexHigh]);
			}

			// Decrement the higher index
			indexHigh = indexHigh - 1;
		}
	}

	// Print out the UTXO pair that added up closest to and exceeded the target
	console.log("Best UTXO pair found: \n" +
				bestPair[0].utxo + " " + bestPair[0].value + ", " +
				bestPair[1].utxo + " " + bestPair[1].value);
});
