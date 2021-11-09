import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { FiniteAutomatonTestInfo, TransformedFiniteAutomaton } from '../types';
import { countFileLines, generateAggregateMessage, generateCaseMessage, testDfa } from '../utils';
import { DeterministicFiniteAutomaton } from './DeterministicFiniteAutomaton';
import { FiniteAutomaton } from './FiniteAutomaton';
import { GenerateString } from './GenerateString';

interface IOutputFiles {
	case: boolean;
	incorrect: boolean;
	correct: boolean;
	input: boolean;
	aggregate: boolean;
}

type IOption =
	| {
			type: 'generate';
			random?: {
				total: number;
				minLength: number;
				maxLength: number;
			};
			range?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'generate';
			range: {
				maxLength: number;
			};
			random?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'file';
			filePath: string;
			outputFiles?: Partial<IOutputFiles>;
	  };

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;
interface IConfig {
	automaton: DeterministicFiniteAutomaton;
	options: IOption;
}
export class FiniteAutomataTest {
	#cliProgressBar: cliProgress.SingleBar;
	#logsPath: string;
	#outputFiles: IOutputFiles;

	constructor(logsPath: string) {
		this.#cliProgressBar = new cliProgress.SingleBar(
			{
				barsize: 20,
				stopOnComplete: true,
				format: colors.green('{bar}') + ' {percentage}% {value}/{total} Chunks',
			},
			cliProgress.Presets.shades_classic
		);
		this.#logsPath = logsPath;
		if (!fs.existsSync(logsPath)) {
			fs.mkdirSync(logsPath);
		}
	}

	#createFileWriteStreams(automatonLabel: string) {
		const writeStreamsRecord: IWriteStreams = {
			caseWriteStream: this.#outputFiles.case
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.case.txt`))
				: null,
			aggregateWriteStream: this.#outputFiles.case
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.aggregate.txt`))
				: null,
			incorrectWriteStream: this.#outputFiles.incorrect
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.incorrect.txt`))
				: null,
			correctWriteStream: this.#outputFiles.correct
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.correct.txt`))
				: null,
			inputWriteStream: this.#outputFiles.input
				? fs.createWriteStream(path.resolve(this.#logsPath, `${automatonLabel}.input.txt`))
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
		const { caseWriteStream, correctWriteStream, incorrectWriteStream, inputWriteStream } =
			writeStreams;

		for (let i = 0; i < inputStrings.length; i++) {
			const inputString = inputStrings[i].replace('\r', '').replace('\n', '');
			if (inputString.length !== 0) {
				const logicTestResult = finiteAutomaton.testLogic(inputString);
				const automatonTestResult = testDfa(finiteAutomaton.automaton, inputString);
				const isWrong = automatonTestResult !== logicTestResult;
				if (!isWrong) {
					if (automatonTestResult === false && logicTestResult === false) {
						finiteAutomatonTestInfo.trueNegatives += 1;
					} else {
						finiteAutomatonTestInfo.truePositives += 1;
					}
					correctWriteStream &&
						correctWriteStream.write(
							(automatonTestResult === true ? 'T' : 'F') +
								' ' +
								(logicTestResult === true ? 'T' : 'F') +
								' ' +
								inputString +
								' ' +
								'\n'
						);
				} else {
					if (automatonTestResult && !logicTestResult) {
						finiteAutomatonTestInfo.falsePositives += 1;
					} else {
						finiteAutomatonTestInfo.falseNegatives += 1;
					}
					incorrectWriteStream &&
						incorrectWriteStream.write(
							(automatonTestResult === true ? 'T' : 'F') +
								' ' +
								(logicTestResult === true ? 'T' : 'F') +
								' ' +
								inputString +
								' ' +
								'\n'
						);
				}
				inputWriteStream && inputWriteStream.write(inputString + '\n');

				const { withoutColors } = generateCaseMessage(
					isWrong,
					inputString,
					automatonTestResult,
					logicTestResult
				);
				caseWriteStream && caseWriteStream.write(withoutColors + '\n');
				this.#cliProgressBar.increment(1);
			}
		}
	}

	#postTest(
		finiteAutomaton: TransformedFiniteAutomaton,
		finiteAutomatonTestInfo: FiniteAutomatonTestInfo,
		finiteAutomatonWriteStreams: {
			record: IWriteStreams;
			endStreams(): void;
		}
	) {
		const {
			record: { aggregateWriteStream },
			endStreams,
		} = finiteAutomatonWriteStreams;
		const { withoutColors, withColors } = generateAggregateMessage(
			finiteAutomaton.label,
			finiteAutomaton.description,
			finiteAutomatonTestInfo
		);

		console.log('\n' + withColors);
		aggregateWriteStream && aggregateWriteStream.write(withoutColors);

		endStreams();
	}

	async test(configs: IConfig[]) {
		const finiteAutomatonTestInfos = configs.map(() => ({
			falsePositives: 0,
			falseNegatives: 0,
			truePositives: 0,
			trueNegatives: 0,
		}));

		for (let index = 0; index < configs.length; index++) {
			const config = configs[index];
			const finiteAutomatonTestInfo = finiteAutomatonTestInfos[index];
			const { automaton, options } = config;
			const writeStreams = this.#createFileWriteStreams(automaton.automaton.label);
			if (options.type === 'file') {
				const readStream = fs.createReadStream(options.filePath);
				const fileLines = await countFileLines(options.filePath);
				this.#cliProgressBar.start(fileLines, 0, {
					speed: 'N/A',
				});
				for await (const chunks of readStream) {
					const inputStrings = chunks.toString().split('\n') as string[];
					this.#testAutomata(automaton, finiteAutomatonTestInfo, writeStreams.record, inputStrings);
				}
			} else if (options.type === 'generate') {
				let generatedStrings: string[] = [];
				if (options.random) {
					generatedStrings = GenerateString.generateRandomUnique(
						options.random.total,
						options.random.minLength,
						options.random.maxLength
					);
				} else if (options.range) {
					generatedStrings = GenerateString.generateAllCombosWithinLength(
						automaton.automaton.alphabets,
						options.range.maxLength
					);
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
			this.#postTest(automaton.automaton, finiteAutomatonTestInfo, writeStreams);
		}
	}
}
