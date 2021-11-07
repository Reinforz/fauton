import fs from 'fs';
import path from 'path';
import dfaTests from './dfa';
import {
	generateAggregateMessage,
	generateBinaryStrings,
	generateCaseMessage,
	generateRandomBinaryStrings,
	testDfa,
} from './utils';

const SHOW_EACH_CASE = false,
	TOTAL_RANDOM_BINARY_STRINGS = 1_000_000,
	BITS_LIMIT = 20,
	GENERATE_RANDOM_BINARY_STRINGS = false;

function createFileWriteStreams(dfaLabel: string) {
	const logPath = path.resolve(__dirname, 'logs');
	return [`${dfaLabel}.txt`, `${dfaLabel}.incorrect.txt`, `${dfaLabel}.correct.txt`].map(
		(fileName) => fs.createWriteStream(path.resolve(logPath, fileName))
	);
}

function main() {
	let generatedBinaryStrings: string[] = [];
	if (GENERATE_RANDOM_BINARY_STRINGS) {
		generatedBinaryStrings = generateRandomBinaryStrings(TOTAL_RANDOM_BINARY_STRINGS, 5, 20);
	} else {
		generatedBinaryStrings = generateBinaryStrings(BITS_LIMIT, { withoutPadding: true });
	}
	// Create the log directory if it doesn't exist
	const logPath = path.resolve(__dirname, 'logs');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath);
	}

	dfaTests.forEach((dfaTest) => {
		// The log files are generated based on the label of the dfa
		const [dfaWriteStream, dfaIncorrectStringsWriteStream, dfaCorrectStringsWriteStream] =
			createFileWriteStreams(dfaTest.DFA.label);

		let totalCorrect = 0,
			totalIncorrect = 0;
		for (let i = 0; i < generatedBinaryStrings.length; i++) {
			const randomBinaryString = generatedBinaryStrings[i];
			const logicTestResult = dfaTest.testLogic(randomBinaryString);
			const dfaTestResult = testDfa(dfaTest.DFA, randomBinaryString);
			const isWrong = dfaTestResult !== logicTestResult;
			if (!isWrong) {
				totalCorrect += 1;
				dfaCorrectStringsWriteStream.write(randomBinaryString + '\n');
			} else {
				totalIncorrect += 1;
				dfaIncorrectStringsWriteStream.write(randomBinaryString + '\n');
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

		console.log(withColors);
		dfaWriteStream.write(withoutColors);

		dfaIncorrectStringsWriteStream.end();
		dfaCorrectStringsWriteStream.end();
		dfaWriteStream.end();
	});
}

main();
