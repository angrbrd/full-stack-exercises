// Read in the binary string from the command line
var str = process.argv[2];
console.log("Input string = " + str + "\n");

// Process the string recursively, building up the string to print starting from
// an empty sting ''.
processString(str, '');

// Recursive function which processes the input string
function processString(string, tmp) {
	// If the string passed in is empty, the base case has been reached. Print
	// the string that was being built up.
	if (string.length == 0) {
		console.log(tmp);
		return
	}

	// If the first character of the remaining string is a 0 or a 1, add it
	// to the temporary string and process the remaining sub-string.
	if ( (string.charAt(0) == '0') || (string.charAt(0) == '1') ) {
		tmp = tmp + string.charAt(0);
		processString(string.substr(1), tmp);
	}
	// If the character is an X, you must try both options: when X is set to
	// 0 and when it is set to 1.
	else if (string.charAt(0) == 'X') {
		tmp = tmp + '0';
		processString(string.substr(1), tmp);

		// Remove the previously added '0' and add a '1' instead
		tmp = tmp.substr(0, tmp.length-1);
		tmp = tmp + '1';
		processString(string.substr(1), tmp);
	}
}
