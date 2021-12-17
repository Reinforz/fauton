/* eslint-disable no-param-reassign */

import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import { AutomatonTestInfo, IAutomaton, InputStringOption, IOutputFiles } from '../../types';
import { FiniteAutomaton } from '../FiniteAutomaton';
import { RegularExpression } from '../RegularExpression';
import * as AutomataTestUtils from './utils';

export type IAutomataTestConfig =
	| {
			automaton: FiniteAutomaton;
			regex?: RegularExpression;
			options: InputStringOption;
	  }
	| {
			automaton?: FiniteAutomaton;
			regex: RegularExpression;
			options: InputStringOption;
	  };

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
		finiteAutomaton: FiniteAutomaton | RegularExpression,
		automatonTestInfo: AutomatonTestInfo,
		writeStreams: IWriteStreams,
		inputStrings: string[]
	) {
		AutomataTestUtils.testAutomaton(
			finiteAutomaton,
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
			automaton: IAutomaton;
			options: InputStringOption;
		}[]
	) {
		AutomataTestUtils.test(
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

export { AutomataTestUtils };
