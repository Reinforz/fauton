/* eslint-disable no-param-reassign */

import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import {
	AutomatonTestInfo,
	IAutomatonInfo,
	IAutomatonTestFn,
	IAutomatonTestLogicFn,
	InputStringOption,
	IOutputFiles,
} from './types';
import * as AutomataTestUtils from './utils';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

export class AutomataTest {
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

	createFileWriteStreams(automatonLabel: string, outputFiles: Partial<IOutputFiles>) {
		return AutomataTestUtils.createFileWriteStreams(this.#logsPath, automatonLabel, outputFiles);
	}

	testAutomata(
		automaton: {
			test: IAutomatonTestFn;
			testLogic: IAutomatonTestLogicFn;
		},
		automatonTestInfo: AutomatonTestInfo,
		writeStreams: IWriteStreams,
		inputStrings: string[]
	) {
		AutomataTestUtils.testAutomaton(
			automaton,
			automatonTestInfo,
			writeStreams,
			inputStrings,
			() => {
				this.#cliProgressBar.increment(1);
			}
		);
	}

	async test(
		configs: {
			automatonInfo: IAutomatonInfo;
			options: InputStringOption;
		}[]
	) {
		AutomataTestUtils.test(
			this.#logsPath,
			configs.map((config) => ({
				automatonInfo: {
					automaton: config.automatonInfo.automaton,
					test: config.automatonInfo.test.bind(config.automatonInfo),
					testLogic: config.automatonInfo.testLogic.bind(config.automatonInfo),
				},
				options: config.options,
			})),
			(totalInputStrings: number) => {
				this.#cliProgressBar.start(totalInputStrings, 0, {
					speed: 'N/A',
				});
			},
			() => {
				this.#cliProgressBar.increment(1);
			}
		);
	}
}

export { AutomataTestUtils };
