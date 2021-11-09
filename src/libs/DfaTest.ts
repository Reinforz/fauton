import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { FiniteAutomatonModule, FiniteAutomatonTestInfo } from '../types';
import { countFileLines, generateAggregateMessage, generateCaseMessage, testDfa } from '../utils';
import { BinaryString } from './BinaryString';
import { DeterministicFiniteAutomaton } from './DeterministicFiniteAutomaton';

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
	#automata: DeterministicFiniteAutomaton[];
	#cliProgressBar: cliProgress.SingleBar;
	#logsPath: string;
	#outputFiles: IOutputFiles;

	constructor(
		automata: DeterministicFiniteAutomaton[],
		logsPath: string,
		outputFiles: Partial<IOutputFiles>
	) {
		this.#automata = automata;
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

	#testAutomata(
		dfaModuleInfos: FiniteAutomatonTestInfo[],
		writeStreams: Array<IWriteStreams>,
		binaryStrings: string[],
		post?: (dfaModule: FiniteAutomatonModule, dfaModuleIndex: number) => void
	) {
		this.#automata.forEach((dfaModule, dfaModuleIndex) => {
			// The log files are generated based on the label of the dfa
			const { caseWriteStream, correctWriteStream, incorrectWriteStream, inputWriteStream } =
				writeStreams[dfaModuleIndex];

			const dfaModuleInfo = dfaModuleInfos[dfaModuleIndex];

			for (let i = 0; i < binaryStrings.length; i++) {
				const binaryString = binaryStrings[i].replace('\r', '').replace('\n', '');
				if (binaryString.length !== 0) {
					const logicTestResult = dfaModule.testLogic(binaryString);
					const dfaModuleResult = testDfa(dfaModule.automaton, binaryString);
					const isWrong = dfaModuleResult !== logicTestResult;
					if (!isWrong) {
						if (dfaModuleResult === false && logicTestResult === false) {
							dfaModuleInfo.trueNegatives += 1;
						} else {
							dfaModuleInfo.truePositives += 1;
						}
						correctWriteStream &&
							correctWriteStream.write(
								(dfaModuleResult === true ? 'T' : 'F') +
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
								(dfaModuleResult === true ? 'T' : 'F') +
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
		dfaModule: FiniteAutomatonModule,
		dfaModuleInfo: FiniteAutomatonTestInfo,
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
			dfaModule.automaton.label,
			dfaModule.automaton.description,
			dfaModuleInfo.falsePositives,
			dfaModuleInfo.falseNegatives,
			dfaModuleInfo.truePositives,
			dfaModuleInfo.trueNegatives
		);

		console.log('\n' + withColors);
		aggregateWriteStream && aggregateWriteStream.write(withoutColors);

		endStreams();
	}

	async test(configs: IConfigs) {
		const writeStreams = this.#automata.map(({ automaton }) =>
			this.#createFileWriteStreams(automaton.label)
		);
		const readStream = configs.type === 'file' ? fs.createReadStream(configs.filePath) : null;

		const dfaModuleInfos = this.#automata.map(() => ({
			falsePositives: 0,
			falseNegatives: 0,
			truePositives: 0,
			trueNegatives: 0,
		}));

		if (configs.type === 'file' && readStream) {
			const fileLines = await countFileLines(configs.filePath);
			this.#cliProgressBar.start(fileLines * this.#automata.length, 0, {
				speed: 'N/A',
			});
			for await (const chunks of readStream) {
				const binaryStrings = chunks.toString().split('\n') as string[];
				this.#testAutomata(
					dfaModuleInfos,
					writeStreams.map(({ writeStreams }) => writeStreams),
					binaryStrings
				);
			}

			this.#automata.forEach((dfaModule, dfaModuleIndex) => {
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
			this.#cliProgressBar.start(binaryStrings.length * this.#automata.length, 0, {
				speed: 'N/A',
			});
			this.#testAutomata(
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
