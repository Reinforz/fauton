import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import dfaTests from './dfa';
import { generateAggregateMessage, generateCaseMessage, testDfa } from './utils';

/* 
const TOTAL_RANDOM_BINARY_STRINGS = 1_000_000,
	BITS_LIMIT = 3,
	GENERATE_RANDOM_BINARY_STRINGS = false; */

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

const cliProgressBar = new cliProgress.SingleBar(
	{
		format: colors.green('{bar}') + '| {percentage}% || {value}/{total} Chunks',
	},
	cliProgress.Presets.shades_classic
);

async function main() {
	/* let generatedBinaryStrings: string[] = [];
	if (GENERATE_RANDOM_BINARY_STRINGS) {
		generatedBinaryStrings = generateRandomBinaryStrings(TOTAL_RANDOM_BINARY_STRINGS, 5, 20);
	} else {
		generatedBinaryStrings = generateBinaryStrings(BITS_LIMIT);
	} */
	// Create the log directory if it doesn't exist
	const logPath = path.resolve(__dirname, 'logs');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath);
	}

	cliProgressBar.start(2097712 * dfaTests.length, 0, {
		speed: 'N/A',
	});

	const writeStreams = dfaTests.map((dfaTest) => createFileWriteStreams(dfaTest.DFA.label));

	const readableStream = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
	const dfaTestInfos = dfaTests.map(() => ({
		falsePositives: 0,
		falseNegatives: 0,
		truePositives: 0,
		trueNegatives: 0,
	}));

	for await (const chunks of readableStream) {
		const generatedBinaryStrings = chunks.toString().split('\n') as string[];
		dfaTests.forEach((dfaTest, dfaTestIndex) => {
			// The log files are generated based on the label of the dfa
			const {
				streams: [
					dfaWriteStream,
					dfaIncorrectStringsWriteStream,
					dfaCorrectStringsWriteStream,
					dfaInputStringsWriteStream,
				],
			} = writeStreams[dfaTestIndex];

			const dfaTestInfo = dfaTestInfos[dfaTestIndex];

			for (let i = 0; i < generatedBinaryStrings.length; i++) {
				const randomBinaryString = generatedBinaryStrings[i].replace('\r', '');
				const logicTestResult = dfaTest.testLogic(randomBinaryString);
				const dfaTestResult = testDfa(dfaTest.DFA, randomBinaryString);
				const isWrong = dfaTestResult !== logicTestResult;
				if (!isWrong) {
					if (dfaTestResult === false && logicTestResult === false) {
						dfaTestInfo.trueNegatives += 1;
					} else {
						dfaTestInfo.truePositives += 1;
					}
					dfaCorrectStringsWriteStream.write(
						randomBinaryString + ' ' + dfaTestResult + ' ' + logicTestResult + '\n'
					);
				} else {
					if (dfaTestResult && !logicTestResult) {
						dfaTestInfo.falsePositives += 1;
					} else {
						dfaTestInfo.falseNegatives += 1;
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
			cliProgressBar.increment(generatedBinaryStrings.length);
		});
	}

	cliProgressBar.stop();

	dfaTests.forEach((dfaTest, dfaTestIndex) => {
		const {
			streams: [dfaWriteStream],
		} = writeStreams[dfaTestIndex];
		const dfaTestInfo = dfaTestInfos[dfaTestIndex];
		const { withoutColors, withColors } = generateAggregateMessage(
			dfaTest.DFA.label,
			dfaTest.DFA.description,
			dfaTestInfo.falsePositives,
			dfaTestInfo.falseNegatives,
			dfaTestInfo.truePositives,
			dfaTestInfo.trueNegatives
		);

		console.log(withColors);
		dfaWriteStream.write(withoutColors);

		writeStreams[dfaTestIndex].endStreams();
	});
}

main();
