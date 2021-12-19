import fs from 'fs';
import { testAutomaton } from '../../../src/libs/AutomataTest/utils/testAutomaton';
import { DeterministicFiniteAutomaton } from '../../../src/libs/DeterministicFiniteAutomaton';
import { AutomatonTestInfo, IOutputFiles } from '../../../src/types';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

it(`Should work`, () => {
	const finiteAutomatonTestInfo: AutomatonTestInfo = {
		falseNegatives: 0,
		falsePositives: 0,
		trueNegatives: 0,
		truePositives: 0,
	};

	const acceptedWriteStreamMock = jest.fn();
	const caseWriteStreamMock = jest.fn();
	const correctWriteStreamMock = jest.fn();
	const rejectedWriteStreamMock = jest.fn();
	const incorrectWriteStreamMock = jest.fn();
	const inputWriteStreamMock = jest.fn();

	const writeStreams: IWriteStreams = {
		acceptedWriteStream: { write: acceptedWriteStreamMock },
		caseWriteStream: { write: caseWriteStreamMock },
		correctWriteStream: { write: correctWriteStreamMock },
		rejectedWriteStream: { write: rejectedWriteStreamMock },
		incorrectWriteStream: { write: incorrectWriteStreamMock },
		inputWriteStream: { write: inputWriteStreamMock },
	} as any;

	testAutomaton(
		new DeterministicFiniteAutomaton(
			(inputString) => {
				switch (inputString) {
					// False positive
					case '101': {
						return true;
					}
					// False negative
					case '11': {
						return false;
					}
					// True positive
					case '111': {
						return false;
					}
					// True negative
					case '01': {
						return true;
					}
					default: {
						return true;
					}
				}
			},
			{
				alphabets: ['0', '1'],
				final_states: ['C'],
				label: 'DFA',
				start_state: 'A',
				states: ['A', 'B', 'C', 'D'],
				transitions: {
					A: {
						0: ['B'],
						1: ['B'],
					},
					B: {
						0: ['C'],
						1: ['C'],
					},
					C: {
						0: ['D'],
						1: ['D'],
					},
					D: {
						0: ['D'],
						1: ['D'],
					},
				},
				epsilon_transitions: null,
			}
		),
		finiteAutomatonTestInfo,
		writeStreams,
		['101', '11', '111', '01', ''],
		() => {}
	);

	expect(finiteAutomatonTestInfo).toStrictEqual({
		falseNegatives: 1,
		falsePositives: 1,
		trueNegatives: 1,
		truePositives: 1,
	});

	expect(JSON.stringify(inputWriteStreamMock.mock.calls)).toStrictEqual(
		JSON.stringify([['101\n'], ['11\n'], ['111\n'], ['01\n']])
	);

	expect(JSON.stringify(incorrectWriteStreamMock.mock.calls)).toStrictEqual(
		JSON.stringify([['F T 101 \n'], ['T F 11 \n']])
	);

	expect(JSON.stringify(correctWriteStreamMock.mock.calls)).toStrictEqual(
		JSON.stringify([['F F 111 \n'], ['T T 01 \n']])
	);

	expect(JSON.stringify(acceptedWriteStreamMock.mock.calls)).toStrictEqual(
		JSON.stringify([['11\n'], ['01\n']])
	);

	expect(JSON.stringify(rejectedWriteStreamMock.mock.calls)).toStrictEqual(
		JSON.stringify([['101\n'], ['111\n']])
	);
});
