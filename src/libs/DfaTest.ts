import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { IDfaModule, IDfaModuleInfo } from '../types';
import { countFileLines, generateAggregateMessage, generateCaseMessage, testDfa } from '../utils';
import { BinaryString } from './BinaryString';

type IConfigs =
	| {
			type: 'generate';
			random?: {
				total: number;
				minLength: number;
				maxLength: number;
			};
			range?: undefined | null;
	  }
	| {
			type: 'generate';
			range: {
				bitLimit: number;
			};
			random?: undefined | null;
	  }
	| {
			type: 'file';
			filePath: string;
	  };

interface IOutputFiles {
	case: boolean;
	incorrect: boolean;
	correct: boolean;
	input: boolean;
	aggregate: boolean;
}
type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

export class DfaTest {
	#dfas: IDfaModule[];
	#cliProgressBar: cliProgress.SingleBar;
	#logsPath: string;
	#outputFiles: IOutputFiles;

	constructor(dfas: IDfaModule[], logsPath: string, outputFiles: Partial<IOutputFiles>) {
		this.#dfas = dfas;
		this.#outputFiles = {
			case: outputFiles.case ?? true,
			aggregate: outputFiles.aggregate ?? true,
			input: outputFiles.input ?? true,
			correct: outputFiles.correct ?? true,
			incorrect: outputFiles.incorrect ?? true,
		};
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

	#createFileWriteStreams(dfaLabel: string) {
		const writeStreams: IWriteStreams = {
			caseWriteStream: this.#outputFiles.case
				? fs.createWriteStream(path.resolve(this.#logsPath, `${dfaLabel}.case.txt`))
				: null,
			aggregateWriteStream: this.#outputFiles.case
				? fs.createWriteStream(path.resolve(this.#logsPath, `${dfaLabel}.aggregate.txt`))
				: null,
			incorrectWriteStream: this.#outputFiles.incorrect
				? fs.createWriteStream(path.resolve(this.#logsPath, `${dfaLabel}.incorrect.txt`))
				: null,
			correctWriteStream: this.#outputFiles.correct
				? fs.createWriteStream(path.resolve(this.#logsPath, `${dfaLabel}.correct.txt`))
				: null,
			inputWriteStream: this.#outputFiles.input
				? fs.createWriteStream(path.resolve(this.#logsPath, `${dfaLabel}.input.txt`))
				: null,
		};

		return {
			writeStreams,
			endStreams() {
				Object.values(writeStreams).forEach((writeStream) => {
					if (writeStream) {
						writeStream.end();
					}
				});
			},
		};
	}

	#testDfas(
		dfaModuleInfos: IDfaModuleInfo[],
		writeStreams: Array<IWriteStreams>,
		binaryStrings: string[],
		post?: (dfaModule: IDfaModule, dfaModuleIndex: number) => void
	) {
		this.#dfas.forEach((dfaModule, dfaModuleIndex) => {
			// The log files are generated based on the label of the dfa
			const { caseWriteStream, correctWriteStream, incorrectWriteStream, inputWriteStream } =
				writeStreams[dfaModuleIndex];

			const dfaModuleInfo = dfaModuleInfos[dfaModuleIndex];

			for (let i = 0; i < binaryStrings.length; i++) {
				const binaryString = binaryStrings[i].replace('\r', '').replace('\n', '');
				if (binaryString.length !== 0) {
					const logicTestResult = dfaModule.testLogic(binaryString);
					const dfaModuleResult = testDfa(dfaModule.DFA, binaryString);
					const isWrong = dfaModuleResult !== logicTestResult;
					if (!isWrong) {
						if (dfaModuleResult === false && logicTestResult === false) {
							dfaModuleInfo.trueNegatives += 1;
						} else {
							dfaModuleInfo.truePositives += 1;
						}
						correctWriteStream &&
							correctWriteStream.write(
								dfaModuleResult === true
									? 'T'
									: 'F' +
											' ' +
											(logicTestResult === true ? 'T' : 'F') +
											' ' +
											binaryString +
											' ' +
											'\n'
							);
					} else {
						if (dfaModuleResult && !logicTestResult) {
							dfaModuleInfo.falsePositives += 1;
						} else {
							dfaModuleInfo.falseNegatives += 1;
						}
						incorrectWriteStream &&
							incorrectWriteStream.write(
								dfaModuleResult === true
									? 'T'
									: 'F' +
											' ' +
											(logicTestResult === true ? 'T' : 'F') +
											' ' +
											binaryString +
											' ' +
											'\n'
							);
					}
					inputWriteStream && inputWriteStream.write(binaryString + '\n');

					const { withoutColors } = generateCaseMessage(
						isWrong,
						binaryString,
						dfaModuleResult,
						logicTestResult
					);
					caseWriteStream && caseWriteStream.write(withoutColors + '\n');
					this.#cliProgressBar.increment(1);
				}
			}
			post && post(dfaModule, dfaModuleIndex);
		});
	}

	#postTest(
		dfaModule: IDfaModule,
		dfaModuleInfo: IDfaModuleInfo,
		dfaModuleWriteStreams: {
			writeStreams: IWriteStreams;
			endStreams(): void;
		}
	) {
		const {
			writeStreams: { aggregateWriteStream },
			endStreams,
		} = dfaModuleWriteStreams;
		const { withoutColors, withColors } = generateAggregateMessage(
			dfaModule.DFA.label,
			dfaModule.DFA.description,
			dfaModuleInfo.falsePositives,
			dfaModuleInfo.falseNegatives,
			dfaModuleInfo.truePositives,
			dfaModuleInfo.trueNegatives
		);

		console.log('\n' + withColors);
		aggregateWriteStream && aggregateWriteStream.write(withoutColors);

		endStreams();
	}

	#validateDfaModule(dfa: IDfaModule) {
		const errors: string[] = [];
		if (!dfa.testLogic) {
			errors.push('testLogic function is required in dfa module');
		}

		if (!dfa.DFA.label) {
			errors.push('Dfa label is required');
		}

		if (!dfa.DFA.states) {
			errors.push('Dfa states is required');

			// Required when checking final_states and transition tuple states
			dfa.DFA.states = [];
		}

		if (!Array.isArray(dfa.DFA.states)) {
			errors.push('Dfa states must be an array');
		}

		if (dfa.DFA.states.length === 0) {
			errors.push('Dfa states must be an array of length > 0');
		}

		dfa.DFA.states.forEach((state) => {
			if (!dfa.DFA.transitions[state]) {
				errors.push(`Dfa states must reference a state (${state}) that is present in transitions`);
			}
		});

		if (dfa.DFA.start_state === undefined || dfa.DFA.start_state === null) {
			errors.push('Dfa start_state is required');
		}

		if (dfa.DFA.final_states === undefined || dfa.DFA.final_states === null) {
			errors.push('Dfa final_states is required');
			dfa.DFA.final_states = [];
		}

		if (!Array.isArray(dfa.DFA.final_states)) {
			errors.push('Dfa final_states must be an array');
		}

		if (dfa.DFA.final_states.length === 0) {
			errors.push('Dfa final_states must be an array of length > 0');
		}

		dfa.DFA.final_states.forEach((state) => {
			if (!dfa.DFA.states.includes(state)) {
				errors.push(`Dfa final_states must reference a state (${state}) that is present in states`);
			}
		});

		Object.entries(dfa.DFA.transitions).forEach(([transitionKey, transitionValues]) => {
			if (!dfa.DFA.states.includes(transitionKey)) {
				errors.push(
					`Dfa transitions must reference a state (${transitionKey}) that is present in states`
				);
			}

			if (typeof transitionValues !== 'string' && !Array.isArray(transitionValues)) {
				errors.push(`Dfa transitions value must either be string "loop" or a tuple`);
			}

			if (Array.isArray(transitionValues) && transitionValues.length !== 2) {
				errors.push(`Dfa transitions value, when a tuple can contain only 2 items`);
			}

			if (typeof transitionValues === 'string' && transitionValues !== 'loop') {
				errors.push(`Dfa transitions value, when a string can only be "loop"`);
			}

			if (Array.isArray(transitionValues)) {
				transitionValues.forEach((transitionValue) => {
					if (!dfa.DFA.states.includes(transitionValue)) {
						errors.push(`Dfa transitions value, when a tuple must reference a valid state`);
					}
				});
			}
		});
		return errors;
	}

	async test(configs: IConfigs) {
		const dfaModulesValidationErrors: { label: string; errors: string[] }[] = [];
		let totalDfaModulesValidationErrors = 0;
		this.#dfas.forEach((dfaModule) => {
			const dfaModuleValidationErrors = this.#validateDfaModule(dfaModule);
			console.log(
				`${colors.blue.bold(dfaModule.DFA.label)} ${colors.red.bold(
					dfaModuleValidationErrors.length.toString()
				)} Errors`
			);
			dfaModuleValidationErrors.forEach((dfaModuleValidationError) =>
				console.log(colors.red.bold(dfaModuleValidationError))
			);
			totalDfaModulesValidationErrors += dfaModuleValidationErrors.length;
			dfaModulesValidationErrors.push({
				label: dfaModule.DFA.label,
				errors: dfaModuleValidationErrors,
			});
			console.log();
		});

		if (dfaModulesValidationErrors.length !== 0) {
			console.log(colors.bold.red(`Total errors ${totalDfaModulesValidationErrors}`));
			throw new Error(`Error validating dfa modules`);
		}

		const writeStreams = this.#dfas.map((dfaModule) =>
			this.#createFileWriteStreams(dfaModule.DFA.label)
		);
		const readStream = configs.type === 'file' ? fs.createReadStream(configs.filePath) : null;

		const dfaModuleInfos = this.#dfas.map(() => ({
			falsePositives: 0,
			falseNegatives: 0,
			truePositives: 0,
			trueNegatives: 0,
		}));

		if (configs.type === 'file' && readStream) {
			const fileLines = await countFileLines(configs.filePath);
			this.#cliProgressBar.start(fileLines * this.#dfas.length, 0, {
				speed: 'N/A',
			});
			for await (const chunks of readStream) {
				const binaryStrings = chunks.toString().split('\n') as string[];
				this.#testDfas(
					dfaModuleInfos,
					writeStreams.map(({ writeStreams }) => writeStreams),
					binaryStrings
				);
			}

			this.#dfas.forEach((dfaModule, dfaModuleIndex) => {
				this.#postTest(dfaModule, dfaModuleInfos[dfaModuleIndex], writeStreams[dfaModuleIndex]);
			});
		} else if (configs.type === 'generate') {
			let binaryStrings: string[] = [];
			if (configs.random) {
				binaryStrings = BinaryString.generateRandomUnique(
					configs.random.total,
					configs.random.minLength,
					configs.random.maxLength
				);
			} else if (configs.range) {
				binaryStrings = BinaryString.generateAllCombosWithinBitLimit(configs.range.bitLimit);
			}
			this.#cliProgressBar.start(binaryStrings.length * this.#dfas.length, 0, {
				speed: 'N/A',
			});
			this.#testDfas(
				dfaModuleInfos,
				writeStreams.map(({ writeStreams }) => writeStreams),
				binaryStrings,
				(dfaModule, dfaModuleIndex) => {
					this.#postTest(dfaModule, dfaModuleInfos[dfaModuleIndex], writeStreams[dfaModuleIndex]);
				}
			);
		}
	}
}
