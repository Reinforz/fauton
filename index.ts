import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { IDfaModule } from './types';
import {
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
				bits: number;
			};
			random?: undefined | null;
	  }
	| {
			type: 'file';
			filePath?: string;
	  };

export class DfaTest {
	dfas: IDfaModule[];
	cliProgressBar: cliProgress.SingleBar;
	logPath: string;

	constructor(dfas: IDfaModule[]) {
		this.dfas = dfas;
		this.cliProgressBar = new cliProgress.SingleBar(
			{
				format: colors.green('{bar}') + '| {percentage}% || {value}/{total} Chunks',
			},
			cliProgress.Presets.shades_classic
		);
		this.logPath = path.resolve(__dirname, 'logs');
		if (!fs.existsSync(this.logPath)) {
			fs.mkdirSync(this.logPath);
		}
	}

	#createFileWriteStreams(dfaLabel: string) {
		const generatedStreams = [
			`${dfaLabel}.txt`,
			`${dfaLabel}.incorrect.txt`,
			`${dfaLabel}.correct.txt`,
			`${dfaLabel}.input.txt`,
		].map((fileName) => fs.createWriteStream(path.resolve(this.logPath, fileName)));

		return {
			streams: generatedStreams,
			endStreams() {
				generatedStreams.forEach((generatedStream) => generatedStream.end());
			},
		};
	}

	#testDfas(
		dfaTestInfos: {
			falsePositives: number;
			falseNegatives: number;
			truePositives: number;
			trueNegatives: number;
		}[],
		writeStreams: Array<fs.WriteStream[]>,
		binaryStrings: string[]
	) {
		this.dfas.forEach((dfaTest, dfaTestIndex) => {
			// The log files are generated based on the label of the dfa
			const [
				dfaWriteStream,
				dfaIncorrectStringsWriteStream,
				dfaCorrectStringsWriteStream,
				dfaInputStringsWriteStream,
			] = writeStreams[dfaTestIndex];

			const dfaTestInfo = dfaTestInfos[dfaTestIndex];

			for (let i = 0; i < binaryStrings.length; i++) {
				const binaryString = binaryStrings[i].replace('\r', '');
				const logicTestResult = dfaTest.testLogic(binaryString);
				const dfaTestResult = testDfa(dfaTest.DFA, binaryString);
				const isWrong = dfaTestResult !== logicTestResult;
				if (!isWrong) {
					if (dfaTestResult === false && logicTestResult === false) {
						dfaTestInfo.trueNegatives += 1;
					} else {
						dfaTestInfo.truePositives += 1;
					}
					dfaCorrectStringsWriteStream.write(
						binaryString + ' ' + dfaTestResult + ' ' + logicTestResult + '\n'
					);
				} else {
					if (dfaTestResult && !logicTestResult) {
						dfaTestInfo.falsePositives += 1;
					} else {
						dfaTestInfo.falseNegatives += 1;
					}
					dfaIncorrectStringsWriteStream.write(
						binaryString + ' ' + dfaTestResult + ' ' + logicTestResult + '\n'
					);
				}
				dfaInputStringsWriteStream.write(binaryString + '\n');

				const { withoutColors } = generateCaseMessage(
					isWrong,
					binaryString,
					dfaTestResult,
					logicTestResult
				);
				dfaWriteStream.write(withoutColors + '\n');
			}
			this.cliProgressBar.increment(binaryStrings.length);
		});
	}

	async test(configs: IConfigs) {
		const writeStreams = this.dfas.map((dfaTest) =>
			this.#createFileWriteStreams(dfaTest.DFA.label)
		);
		const readStream =
			configs.type === 'file'
				? fs.createReadStream(configs.filePath ?? path.resolve(__dirname, 'input.txt'))
				: null;

		const dfaTestInfos = this.dfas.map(() => ({
			falsePositives: 0,
			falseNegatives: 0,
			truePositives: 0,
			trueNegatives: 0,
		}));

		if (configs.type === 'file' && readStream) {
			this.cliProgressBar.start(2097712 * this.dfas.length, 0, {
				speed: 'N/A',
			});
			for await (const chunks of readStream) {
				const binaryStrings = chunks.toString().split('\n') as string[];
				this.#testDfas(
					dfaTestInfos,
					writeStreams.map(({ streams }) => streams),
					binaryStrings
				);
			}
		} else if (configs.type === 'generate') {
			let binaryStrings: string[] = [];
			if (configs.random) {
				binaryStrings = generateRandomBinaryStrings(
					configs.random.total,
					configs.random.minLength,
					configs.random.maxLength
				);
			} else if (configs.range) {
				binaryStrings = generateBinaryStrings(configs.range.bits);
			}
			this.cliProgressBar.start(binaryStrings.length * this.dfas.length, 0, {
				speed: 'N/A',
			});
			this.#testDfas(
				dfaTestInfos,
				writeStreams.map(({ streams }) => streams),
				binaryStrings
			);
		}

		this.cliProgressBar.stop();

		this.dfas.forEach((dfaTest, dfaTestIndex) => {
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
}
