import fs from 'fs';
import { AutomatonTestInfo, IAutomaton, InputStringOption } from '../../../types';
import { countFileLines } from '../../../utils/countFileLines';
import { generateAggregateMessage } from '../../../utils/generateAggregateMessage';
import { GenerateString } from '../../GenerateString';
import { createFileWriteStreams } from './createFileWriteStreams';
import { testAutomaton } from './testAutomaton';

export async function test(
	logsPath: string,
	configs: {
		automaton: IAutomaton;
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
		const { automaton, options } = config;
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
			for await (const chunks of readStream) {
				const inputStrings = chunks.split('\n') as string[];
				testAutomaton(
					automaton,
					automatonTestInfo,
					writeStreams.record,
					inputStrings,
					postAutomatonTestCb
				);
			}
		} else {
			let generatedStrings: string[] = [];
			if (options.type === 'generate') {
				if (options.random) {
					generatedStrings = GenerateString.generateRandomUnique(
						options.random.total,
						automaton.alphabets,
						options.random.minLength,
						options.random.maxLength
					);
				} else {
					generatedStrings = GenerateString.generateAllCombosWithinLength(
						automaton.alphabets,
						options.combo!.maxLength,
						options.combo!.startLength ?? 1,
						options.languageChecker
					);
				}
			} else {
				generatedStrings = options.inputs;
			}

			if (preAutomatonTestCb) {
				preAutomatonTestCb(generatedStrings.length);
			}
			testAutomaton(
				automaton,
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
