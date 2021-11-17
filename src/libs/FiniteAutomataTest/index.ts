/* eslint-disable no-param-reassign */

import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import { FiniteAutomatonTestInfo, InputStringOption, IOutputFiles } from '../../types';
import { FiniteAutomaton } from '../FiniteAutomaton';
import * as FiniteAutomataTestUtils from './utils';

export interface IAutomataTestConfig {
	automaton: FiniteAutomaton;
	options: InputStringOption;
}

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

export class FiniteAutomataTest {
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
		return FiniteAutomataTestUtils.createFileWriteStreams(
			this.#logsPath,
			automatonLabel,
			outputFiles
		);
	}

	testAutomata(
		finiteAutomaton: FiniteAutomaton,
		finiteAutomatonTestInfo: FiniteAutomatonTestInfo,
		writeStreams: IWriteStreams,
		inputStrings: string[]
	) {
		FiniteAutomataTestUtils.testAutomaton(
			finiteAutomaton,
			finiteAutomatonTestInfo,
			writeStreams,
			inputStrings,
			() => {
				this.#cliProgressBar.increment(1);
			}
		);
	}

	async test(
		configs: {
			automaton: FiniteAutomaton;
			options: InputStringOption;
		}[]
	) {
		FiniteAutomataTestUtils.test(
			this.#logsPath,
			configs,
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

export { FiniteAutomataTestUtils };
