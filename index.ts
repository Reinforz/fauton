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

const TOTAL_RANDOM_BINARY_STRINGS = 1_000_000,
	BITS_LIMIT = 3,
	GENERATE_RANDOM_BINARY_STRINGS = false;

function createFileWriteStreams(dfaLabel: string) {
	const logPath = path.resolve(__dirname, 'logs');
	const generatedStreams = [
		`${dfaLabel}.txt`,
		`${dfaLabel}.incorrect.txt`,
		`${dfaLabel}.correct.txt`,
		`${dfaLabel}.input.txt`,
	].map((fileName) => fs.createWriteStream(path.resolve(logPath, fileName)));

	return {
		streams: generatedStreams,
		endStreams() {
			generatedStreams.forEach((generatedStream) => generatedStream.end());
		},
	};
}

function main() {
	let generatedBinaryStrings: string[] = [];
	if (GENERATE_RANDOM_BINARY_STRINGS) {
		generatedBinaryStrings = generateRandomBinaryStrings(TOTAL_RANDOM_BINARY_STRINGS, 5, 20);
	} else {
		generatedBinaryStrings = generateBinaryStrings(BITS_LIMIT);
	}
	// Create the log directory if it doesn't exist
	const logPath = path.resolve(__dirname, 'logs');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath);
	}

	dfaTests.forEach((dfaTest) => {
		// The log files are generated based on the label of the dfa
		const {
			streams: [
				dfaWriteStream,
				dfaIncorrectStringsWriteStream,
				dfaCorrectStringsWriteStream,
				dfaInputStringsWriteStream,
			],
			endStreams,
		} = createFileWriteStreams(dfaTest.DFA.label);

		let falsePositives = 0,
			falseNegatives = 0,
			truePositives = 0,
			trueNegatives = 0;
		for (let i = 0; i < generatedBinaryStrings.length; i++) {
			const randomBinaryString = generatedBinaryStrings[i];
			const logicTestResult = dfaTest.testLogic(randomBinaryString);
			const dfaTestResult = testDfa(dfaTest.DFA, randomBinaryString);
			const isWrong = dfaTestResult !== logicTestResult;
			if (!isWrong) {
				if (dfaTestResult === false && logicTestResult === false) {
					trueNegatives += 1;
				} else {
					truePositives += 1;
				}
				dfaCorrectStringsWriteStream.write(
					randomBinaryString + ' ' + dfaTestResult + ' ' + logicTestResult + '\n'
				);
			} else {
				if (dfaTestResult && !logicTestResult) {
					falsePositives += 1;
				} else {
					falseNegatives += 1;
				}
				dfaIncorrectStringsWriteStream.write(
					randomBinaryString + ' ' + dfaTestResult + ' ' + logicTestResult + '\n'
				);
			}
			dfaInputStringsWriteStream.write(randomBinaryString + '\n');

			const { withoutColors } = generateCaseMessage(
				isWrong,
				randomBinaryString,
				dfaTestResult,
				logicTestResult
			);
			dfaWriteStream.write(withoutColors + '\n');
		}

		const { withoutColors, withColors } = generateAggregateMessage(
			dfaTest.DFA.label,
			dfaTest.DFA.description,
			falsePositives,
			falseNegatives,
			truePositives,
			trueNegatives
		);

		console.log(withColors);
		dfaWriteStream.write(withoutColors);

		endStreams();
	});
}

main();
