const { DfaTest } = require('dfa-test');
const path = require('path');

// Check out this file to see how to write a dfa module
const dfa1Module = require('./dfa1');

const dfaTest = new DfaTest(
	// An array for dfa modules
	[dfa1Module],
	// Path to the log directory
	path.resolve(__dirname, 'logs')
);

async function main() {
	// Generate random binary strings of all combination between 1 and 20 bits
	await dfaTest.test({
		type: 'generate',
		range: {
			bitLimit: 20,
		},
	});

	// Generate unique random binary strings
	await dfaTest.test({
		type: 'generate',
		random: {
			// 100k random binary strings
			total: 100_000,
			// Minimum bit length
			minLength: 5,
			// Minimum bit length
			maxLength: 20,
		},
	});

	// Read a file that already has binary strings
	await dfaTest.test({
		type: 'file',
		filePath: path.resolve(__dirname, 'input.txt'),
	});
}

main();
