import fs from 'fs';
import { AutomatonTestInfo, IAutomatonInfo, InputStringOption } from '../types';
import { countFileLines } from './countFileLines';
import { createFileWriteStreams } from './createFileWriteStreams';
import { generateAggregateMessage } from './generateAggregateMessage';
import { generateRandomLanguage } from './generateRandomLanguage';
import { generateUniversalLanguage } from './generateUniversalLanguage';
import { testAutomaton } from './testAutomaton';

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
	const AutomatonTestInfos: AutomatonTestInfo[] = configs.map(() => ({
		falsePositives: 0,
		falseNegatives: 0,
		truePositives: 0,
		trueNegatives: 0,
	}));

	for (let index = 0; index < configs.length; index += 1) {
		const config = configs[index];
		const automatonTestInfo = AutomatonTestInfos[index];
		const {
			automatonInfo: { automaton, ...automatonTest },
			options,
		} = config;
		const writeStreams = createFileWriteStreams(logsPath, automaton.label, {
			aggregate: options.outputFiles?.aggregate ?? true,
			case: options.outputFiles?.case ?? true,
			correct: options.outputFiles?.correct ?? true,
			incorrect: options.outputFiles?.incorrect ?? true,
			input: options.outputFiles?.input ?? true,
			accepted: options.outputFiles?.accepted ?? true,
			rejected: options.outputFiles?.rejected ?? true,
		});

		if (options.type === 'file') {
			const readStream = fs.createReadStream(options.filePath, { encoding: 'utf-8' });
			const fileLines = await countFileLines(options.filePath);
			if (preAutomatonTestCb) {
				preAutomatonTestCb(fileLines);
			}
			// eslint-disable-next-line
			for await (const chunk of readStream) {
				const lines = chunk.split('\n') as string[];
				testAutomaton(
					automatonTest,
					automatonTestInfo,
					writeStreams.record,
					lines.map((line) => line.split(' ')),
					postAutomatonTestCb
				);
			}
		} else {
			let generatedStrings: string[][] = [];
			if (options.type === 'generate') {
				if (options.random) {
					generatedStrings = generateRandomLanguage(
						options.random.total,
						automaton.alphabets,
						options.random.minTokenLength,
						options.random.maxTokenLength
					);
				} else {
					generatedStrings = generateUniversalLanguage(
						automaton.alphabets,
						options.combo!.maxTokenLength,
						options.combo!.startLength ?? 1
					);
				}
			} else {
				generatedStrings = options.inputs;
			}

			if (preAutomatonTestCb) {
				preAutomatonTestCb(generatedStrings.length);
			}
			testAutomaton(
				automatonTest,
				automatonTestInfo,
				writeStreams.record,
				generatedStrings,
				postAutomatonTestCb
			);
		}

		// Run the postTest hook after all the automaton tests have been completed
		const {
			record: { aggregateWriteStream },
			endStreams,
		} = writeStreams;
		const { withoutColors, withColors } = generateAggregateMessage(
			automaton.label,
			automaton.description,
			automatonTestInfo
		);

		// eslint-disable-next-line
		console.log(`\n${withColors}`);
		if (aggregateWriteStream) {
			aggregateWriteStream.write(withoutColors);
		}

		endStreams();
	}
}
