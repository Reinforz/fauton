import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { IDfaModule, IDfaModuleInfo } from './types';
import {
	countFileLines,
	generateAggregateMessage,
	generateBinaryStrings,
	generateCaseMessage,
	generateRandomBinaryStrings,
	testDfa,
} from './utils';

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

export class DfaTest {
	#dfas: IDfaModule[];
	#cliProgressBar: cliProgress.SingleBar;
	logsPath: string;

	constructor(dfas: IDfaModule[], logsPath: string) {
		this.#dfas = dfas;
		this.#cliProgressBar = new cliProgress.SingleBar(
			{
				stopOnComplete: true,
				format: colors.green('{bar}') + '| {percentage}% || {value}/{total} Chunks',
			},
			cliProgress.Presets.shades_classic
		);
		this.logsPath = logsPath;
		if (!fs.existsSync(logsPath)) {
			fs.mkdirSync(logsPath);
		}
	}

	#createFileWriteStreams(dfaLabel: string) {
		const generatedStreams = [
			`${dfaLabel}.txt`,
			`${dfaLabel}.incorrect.txt`,
			`${dfaLabel}.correct.txt`,
			`${dfaLabel}.input.txt`,
		].map((fileName) => fs.createWriteStream(path.resolve(this.logsPath, fileName)));

		return {
			streams: generatedStreams,
			endStreams() {
				generatedStreams.forEach((generatedStream) => generatedStream.end());
			},
		};
	}

	#testDfas(
		dfaModuleInfos: IDfaModuleInfo[],
		writeStreams: Array<fs.WriteStream[]>,
		binaryStrings: string[],
		post?: (dfaModule: IDfaModule, dfaModuleIndex: number) => void
	) {
		this.#dfas.forEach((dfaModule, dfaModuleIndex) => {
			// The log files are generated based on the label of the dfa
			const [
				dfaWriteStream,
				dfaIncorrectStringsWriteStream,
				dfaCorrectStringsWriteStream,
				dfaInputStringsWriteStream,
			] = writeStreams[dfaModuleIndex];

			const dfaModuleInfo = dfaModuleInfos[dfaModuleIndex];

			for (let i = 0; i < binaryStrings.length; i++) {
				const binaryString = binaryStrings[i].replace('\r', '');
				const logicTestResult = dfaModule.testLogic(binaryString);
				const dfaModuleResult = testDfa(dfaModule.DFA, binaryString);
				const isWrong = dfaModuleResult !== logicTestResult;
				if (!isWrong) {
					if (dfaModuleResult === false && logicTestResult === false) {
						dfaModuleInfo.trueNegatives += 1;
					} else {
						dfaModuleInfo.truePositives += 1;
					}
					dfaCorrectStringsWriteStream.write(
						binaryString + ' ' + dfaModuleResult + ' ' + logicTestResult + '\n'
					);
				} else {
					if (dfaModuleResult && !logicTestResult) {
						dfaModuleInfo.falsePositives += 1;
					} else {
						dfaModuleInfo.falseNegatives += 1;
					}
					dfaIncorrectStringsWriteStream.write(
						binaryString + ' ' + dfaModuleResult + ' ' + logicTestResult + '\n'
					);
				}
				dfaInputStringsWriteStream.write(binaryString + '\n');

				const { withoutColors } = generateCaseMessage(
					isWrong,
					binaryString,
					dfaModuleResult,
					logicTestResult
				);
				dfaWriteStream.write(withoutColors + '\n');
				this.#cliProgressBar.increment(1);
			}
			post && post(dfaModule, dfaModuleIndex);
		});
	}

	#postTest(
		dfaModule: IDfaModule,
		dfaModuleInfo: IDfaModuleInfo,
		dfaModuleWriteStreams: {
			streams: fs.WriteStream[];
			endStreams(): void;
		}
	) {
		const {
			streams: [dfaWriteStream],
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
		dfaWriteStream.write(withoutColors);

		endStreams();
	}

	async test(configs: IConfigs) {
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
					writeStreams.map(({ streams }) => streams),
					binaryStrings
				);
			}

			this.#dfas.forEach((dfaModule, dfaModuleIndex) => {
				this.#postTest(dfaModule, dfaModuleInfos[dfaModuleIndex], writeStreams[dfaModuleIndex]);
			});
		} else if (configs.type === 'generate') {
			let binaryStrings: string[] = [];
			if (configs.random) {
				binaryStrings = generateRandomBinaryStrings(
					configs.random.total,
					configs.random.minLength,
					configs.random.maxLength
				);
			} else if (configs.range) {
				binaryStrings = generateBinaryStrings(configs.range.bitLimit);
			}
			this.#cliProgressBar.start(binaryStrings.length * this.#dfas.length, 0, {
				speed: 'N/A',
			});
			this.#testDfas(
				dfaModuleInfos,
				writeStreams.map(({ streams }) => streams),
				binaryStrings,
				(dfaModule, dfaModuleIndex) => {
					this.#postTest(dfaModule, dfaModuleInfos[dfaModuleIndex], writeStreams[dfaModuleIndex]);
				}
			);
		}
	}
}

export * from './types';
export * from './utils';
