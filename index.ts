import fs from 'fs';
import path from 'path';
import { IDfaTest } from './types';
import {
	generateAggregateMessage,
	generateBinaryStrings,
	generateCaseMessage,
	generateRandomBinaryStrings,
	testDfa,
} from './utils';

const SHOW_EACH_CASE = false,
	LIMIT = 10_000_000,
	RANDOM_BINARY_STRINGS = true;

const dfaTests: IDfaTest[] = [];

function main() {
	let generatedBinaryStrings: string[] = [];
	if (RANDOM_BINARY_STRINGS) {
		generatedBinaryStrings = generateRandomBinaryStrings(LIMIT, 1, 20);
	} else {
		generatedBinaryStrings = generateBinaryStrings(LIMIT);
	}
	// Create the log directory if it doesn't exist
	const logPath = path.resolve(__dirname, 'logs');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath);
	}

	dfaTests.forEach((dfaTest) => {
		// The log files are generated based on the label of the dfa
		const dfaFilePath = path.resolve(logPath, `${dfaTest.DFA.label}.txt`);
		const dfaWriteStream = fs.createWriteStream(dfaFilePath);
		const wrongStrings = [],
			correctStrings = [];
		let totalCorrect = 0,
			totalIncorrect = 0;
		for (let i = 0; i < generatedBinaryStrings.length; i++) {
			const randomBinaryString = generatedBinaryStrings[i];
			const logicTestResult = dfaTest.testLogic(randomBinaryString);
			const dfaTestResult = testDfa(dfaTest.DFA, randomBinaryString);
			const isWrong = dfaTestResult !== logicTestResult;
			if (!isWrong) {
				totalCorrect += 1;
				correctStrings.push(randomBinaryString);
			} else {
				totalIncorrect += 1;
				wrongStrings.push(randomBinaryString);
			}

			const { withoutColors, withColors } = generateCaseMessage(
				isWrong,
				randomBinaryString,
				dfaTestResult,
				logicTestResult
			);
			dfaWriteStream.write(withoutColors + '\n');
			if (SHOW_EACH_CASE) {
				console.log(withColors);
			}
		}

		const { withoutColors, withColors } = generateAggregateMessage(
			totalCorrect,
			totalIncorrect,
			dfaTest.DFA.label,
			generatedBinaryStrings.length
		);

		dfaWriteStream.write(withoutColors);
		console.log(withColors);

		// Writing all the failed strings in separate file
		const incorrectResultFileWriteStream = fs.createWriteStream(
			path.resolve(logPath, `${dfaTest.DFA.label}.incorrect.txt`)
		);
		incorrectResultFileWriteStream.write(wrongStrings.join('\n'));
		incorrectResultFileWriteStream.end();

		// Writing all the correct strings in separate file
		const correctResultFileWriteStream = fs.createWriteStream(
			path.resolve(logPath, `${dfaTest.DFA.label}.correct.txt`)
		);
		correctResultFileWriteStream.write(correctStrings.join('\n'));
		correctResultFileWriteStream.end();

		dfaWriteStream.end();
	});
}

main();
