import fs from 'fs';
import { FiniteAutomatonTestInfo, InputStringOption } from '../../../types';
import { countFileLines } from '../../../utils/countFileLines';
import { generateAggregateMessage } from '../../../utils/generateAggregateMessage';
import { FiniteAutomaton } from '../../FiniteAutomaton';
import { GenerateString } from '../../GenerateString';
import { createFileWriteStreams } from './createFileWriteStreams';
import { testAutomaton } from './testAutomaton';

export async function test(
	logsPath: string,
	configs: {
		automaton: FiniteAutomaton;
		options: InputStringOption;
	}[],
	// eslint-disable-next-line
	preAutomatonTestCb: (totalInputStrings: number) => void,
	postAutomatonTestCb: () => void
) {
	const finiteAutomatonTestInfos: FiniteAutomatonTestInfo[] = configs.map(() => ({
		falsePositives: 0,
		falseNegatives: 0,
		truePositives: 0,
		trueNegatives: 0,
	}));

	for (let index = 0; index < configs.length; index += 1) {
		const config = configs[index];
		const finiteAutomatonTestInfo = finiteAutomatonTestInfos[index];
		const { automaton, options } = config;
		const writeStreams = createFileWriteStreams(logsPath, automaton.automaton.label, {
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
					finiteAutomatonTestInfo,
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
						automaton.automaton.alphabets,
						options.random.minLength,
						options.random.maxLength
					);
				} else {
					generatedStrings = GenerateString.generateAllCombosWithinLength(
						automaton.automaton.alphabets,
						options.combo!.maxLength
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
				finiteAutomatonTestInfo,
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
			automaton.automaton.label,
			automaton.automaton.description,
			finiteAutomatonTestInfo
		);

		// eslint-disable-next-line
		console.log(`\n${withColors}`);
		if (aggregateWriteStream) {
			aggregateWriteStream.write(withoutColors);
		}

		endStreams();
	}
}
