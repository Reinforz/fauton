import fs from 'fs';
import { AutomatonTestInfo, IAutomatonInfo, InputStringOption } from '../types';
import { countFileLines } from './countFileLines';
import { createFileWriteStreams } from './createFileWriteStreams';
import { generateAggregateMessage } from './generateAggregateMessage';
import { generateRandomLanguage } from './generateRandomLanguage';
import { generateUniversalLanguage } from './generateUniversalLanguage';
import { testAutomaton } from './testAutomaton';

/**
 * Test automatons
 * @param logsPath Path to store the log files
 * @param configs Test configuration for each automaton
 * @param preAutomatonTestCb Callback to call before testing the automaton
 * @param postAutomatonTestCb Callback to call after testing the automaton
 */
export async function test(
	logsPath: string,
	configs: {
		automatonInfo: IAutomatonInfo;
		options: InputStringOption;
	}[],
	// eslint-disable-next-line
	preAutomatonTestCb?: (totalInputStrings: number) => void,
	postAutomatonTestCb?: () => void
) {
	// Generate automaton aggregate test info for each automaton
	const AutomatonTestInfos: AutomatonTestInfo[] = configs.map(() => ({
		falsePositives: 0,
		falseNegatives: 0,
		truePositives: 0,
		trueNegatives: 0,
	}));

	// For each configuration
	for (let index = 0; index < configs.length; index += 1) {
		const config = configs[index];
		const automatonTestInfo = AutomatonTestInfos[index];
		const {
			automatonInfo: { automaton, ...automatonTest },
			options,
		} = config;
		// Create the file write streams for that automaton
		const writeStreams = createFileWriteStreams(logsPath, automaton.label, {
			aggregate: options.outputFiles?.aggregate ?? true,
			case: options.outputFiles?.case ?? true,
			correct: options.outputFiles?.correct ?? true,
			incorrect: options.outputFiles?.incorrect ?? true,
			input: options.outputFiles?.input ?? true,
			accepted: options.outputFiles?.accepted ?? true,
			rejected: options.outputFiles?.rejected ?? true,
		});

		// If we are reading input from a file
		if (options.type === 'file') {
			// Create a read stream to read inputs
			const readStream = fs.createReadStream(options.filePath, { encoding: 'utf-8' });
			// Calculate the total number of lines of that file, used for showing current progress
			const fileLines = await countFileLines(options.filePath);
			// Call the pre test callback
			if (preAutomatonTestCb) {
				preAutomatonTestCb(fileLines);
			}
			// eslint-disable-next-line
			for await (const chunk of readStream) {
				// Split the stream chunk by newline (it is assumed that each input string is separated by new line)
				const lines = chunk.split('\n') as string[];
				// Actually test the automaton using the input strings
				testAutomaton(
					automatonTest,
					automatonTestInfo,
					writeStreams.record,
					lines.map((line) => line.split(' ')),
					postAutomatonTestCb
				);
			}
		} else {
			// Variable to store generated strings
			let generatedStrings: string[][] = [];
			// If we are generating input strings
			if (options.type === 'generate') {
				// If the input strings are generated randomly
				if (options.random) {
					// Generate random strings and store it in variable
					generatedStrings = generateRandomLanguage(
						options.random.total,
						automaton.alphabets,
						options.random.minTokenLength,
						options.random.maxTokenLength
					);
				} else {
					// Generate all possible combination of tokens
					generatedStrings = generateUniversalLanguage(
						automaton.alphabets,
						options.combo!.maxTokenLength,
						options.combo!.startLength ?? 1
					);
				}
			} else {
				// If we are explicitly passing an array of strings
				generatedStrings = options.inputs;
			}
			// Call the callback before testing
			if (preAutomatonTestCb) {
				preAutomatonTestCb(generatedStrings.length);
			}
			// Test the automaton with the generated input strings
			testAutomaton(
				automatonTest,
				automatonTestInfo,
				writeStreams.record,
				generatedStrings,
				postAutomatonTestCb
			);
		}

		const {
			record: { aggregateWriteStream },
			endStreams,
		} = writeStreams;
		// Generate aggregate message of test results
		const { withoutColors, withColors } = generateAggregateMessage(
			automaton.label,
			automaton.description,
			automatonTestInfo
		);

		// eslint-disable-next-line
		console.log(`\n${withColors}`);
		// Only write to aggregate write stream if we want it so
		if (aggregateWriteStream) {
			aggregateWriteStream.write(withoutColors);
		}
		// Close all the write streams
		endStreams();
	}
}
