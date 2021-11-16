/* eslint-disable no-param-reassign */

import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { FiniteAutomatonTestInfo, InputStringOption, IOutputFiles } from '../types';
import { countFileLines, generateAggregateMessage, generateCaseMessage } from '../utils';
import DeterministicFiniteAutomaton from './DeterministicFiniteAutomaton';
import FiniteAutomaton from './FiniteAutomaton';
import GenerateString from './GenerateString';
import NonDeterministicFiniteAutomaton from './NonDeterministicFiniteAutomaton';

interface IAutomataTestConfig {
	automaton: DeterministicFiniteAutomaton | NonDeterministicFiniteAutomaton;
	options: InputStringOption;
}

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;
export default class FiniteAutomataTest {
	#cliProgressBar: cliProgress.SingleBar;

	#logsPath: string;

	constructor(logsPath: string) {
		this.#cliProgressBar = new cliProgress.SingleBar(
			{
				barsize: 20,
				stopOnComplete: true,
				format: `${colors.green('{bar}')} {percentage}% {value}/{total} Chunks`,
			},
			cliProgress.Presets.shades_classic
		);
		this.#logsPath = logsPath;
		if (!fs.existsSync(logsPath)) {
			fs.mkdirSync(logsPath);
		}
	}

	#createFileWriteStreams(automatonLabel: string, outputFiles: Partial<IOutputFiles>) {
		const writeStreamsRecord: IWriteStreams = {
			caseWriteStream: outputFiles.case
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.case.txt`))
				: null,
			aggregateWriteStream: outputFiles.aggregate
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.aggregate.txt`))
				: null,
			incorrectWriteStream: outputFiles.incorrect
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.incorrect.txt`))
				: null,
			correctWriteStream: outputFiles.correct
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.correct.txt`))
				: null,
			inputWriteStream: outputFiles.input
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.input.txt`))
				: null,
			acceptedWriteStream: outputFiles.accepted
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.accepted.txt`))
				: null,
			rejectedWriteStream: outputFiles.rejected
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.rejected.txt`))
				: null,
		};

		return {
			record: writeStreamsRecord,
			endStreams() {
				Object.values(writeStreamsRecord).forEach((writeStream) => {
					if (writeStream) {
						writeStream.end();
					}
				});
			},
		};
	}

	#testAutomata(
		finiteAutomaton: FiniteAutomaton,
		finiteAutomatonTestInfo: FiniteAutomatonTestInfo,
		writeStreams: IWriteStreams,
		inputStrings: string[]
	) {
		// The log files are generated based on the label of the automaton
		const {
			caseWriteStream,
			correctWriteStream,
			acceptedWriteStream,
			rejectedWriteStream,
			incorrectWriteStream,
			inputWriteStream,
		} = writeStreams;

		for (let i = 0; i < inputStrings.length; i += 1) {
			const inputString = inputStrings[i].replace('\r', '').replace('\n', '');
			if (inputString.length !== 0) {
				const { automatonTestResult } = finiteAutomaton.generateGraphFromString(inputString);
				const logicTestResult = finiteAutomaton.testLogic(inputString, automatonTestResult);
				const isWrong = automatonTestResult !== logicTestResult;

				const testResultString = `${automatonTestResult.toString().toUpperCase()[0]} ${
					logicTestResult.toString().toUpperCase()[0]
				} ${inputString} \n`;
				if (!automatonTestResult && rejectedWriteStream) {
					rejectedWriteStream.write(`${inputString}\n`);
				} else if (acceptedWriteStream) {
					acceptedWriteStream.write(`${inputString}\n`);
				}
				if (!isWrong && correctWriteStream) {
					if (automatonTestResult === false && logicTestResult === false) {
						finiteAutomatonTestInfo.trueNegatives += 1;
					} else {
						finiteAutomatonTestInfo.truePositives += 1;
					}
					correctWriteStream.write(testResultString);
				} else if (incorrectWriteStream) {
					if (automatonTestResult && !logicTestResult) {
						finiteAutomatonTestInfo.falsePositives += 1;
					} else {
						finiteAutomatonTestInfo.falseNegatives += 1;
					}
					incorrectWriteStream.write(testResultString);
				}
				if (inputWriteStream) {
					inputWriteStream.write(`${inputString}\n`);
				}

				const { withoutColors } = generateCaseMessage(
					isWrong,
					inputString,
					automatonTestResult,
					logicTestResult
				);
				if (caseWriteStream) caseWriteStream.write(`${withoutColors}\n`);
				this.#cliProgressBar.increment(1);
			}
		}
	}

	async test(configs: IAutomataTestConfig[]) {
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
			const writeStreams = this.#createFileWriteStreams(automaton.automaton.label, {
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
				this.#cliProgressBar.start(fileLines, 0, {
					speed: 'N/A',
				});
				// eslint-disable-next-line
				for await (const chunks of readStream) {
					const inputStrings = chunks.split('\n') as string[];
					this.#testAutomata(automaton, finiteAutomatonTestInfo, writeStreams.record, inputStrings);
				}
			} else {
				let generatedStrings: string[] = [];
				if (options.type === 'generate') {
					if (options.random) {
						generatedStrings = GenerateString.generateRandomUnique(
							options.random.total,
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

				this.#cliProgressBar.start(generatedStrings.length, 0, {
					speed: 'N/A',
				});
				this.#testAutomata(
					automaton,
					finiteAutomatonTestInfo,
					writeStreams.record,
					generatedStrings
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
}
