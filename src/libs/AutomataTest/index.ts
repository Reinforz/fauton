/* eslint-disable no-param-reassign */

import cliProgress from 'cli-progress';
import colors from 'colors';
import fs from 'fs';
import { AutomatonTestInfo, InputStringOption, IOutputFiles } from '../../types';
import { FiniteAutomaton } from '../FiniteAutomaton';
import { RegularExpression } from '../RegularExpression';
import * as FiniteAutomataTestUtils from './utils';

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
		finiteAutomaton: FiniteAutomaton | RegularExpression,
		automatonTestInfo: AutomatonTestInfo,
		writeStreams: IWriteStreams,
		inputStrings: string[]
	) {
		FiniteAutomataTestUtils.testAutomaton(
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
			automaton: FiniteAutomaton | RegularExpression;
			options: InputStringOption;
		}[]
	) {
		FiniteAutomataTestUtils.test(
			this.#logsPath,
			configs.map((config) => ({
				automaton: {
					...config.automaton.automaton,
					test: config.automaton.test,
					testLogic: config.automaton.testLogic,
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

export { FiniteAutomataTestUtils };
