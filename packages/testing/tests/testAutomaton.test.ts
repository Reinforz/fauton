import fs from 'fs';
import { AutomatonTestInfo, IOutputFiles } from '../libs/types';
import { testAutomaton } from '../libs/utils/testAutomaton';

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
		{
			test: () => true,
			testLogic: ([inputToken]) => {
				switch (inputToken) {
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
		},
		finiteAutomatonTestInfo,
		writeStreams,
		[['101'], ['11'], ['111'], ['01'], ['']]
	);

	expect(finiteAutomatonTestInfo).toStrictEqual({
		falseNegatives: 0,
		falsePositives: 2,
		trueNegatives: 0,
		truePositives: 3,
	});

	// expect(JSON.stringify(inputWriteStreamMock.mock.calls)).toStrictEqual(
	// 	JSON.stringify([['101\n'], ['11\n'], ['111\n'], ['01\n']])
	// );

	// expect(JSON.stringify(incorrectWriteStreamMock.mock.calls)).toStrictEqual(
	// 	JSON.stringify([['F T 101 \n'], ['T F 11 \n']])
	// );

	// expect(JSON.stringify(correctWriteStreamMock.mock.calls)).toStrictEqual(
	// 	JSON.stringify([['F F 111 \n'], ['T T 01 \n']])
	// );

	// expect(JSON.stringify(acceptedWriteStreamMock.mock.calls)).toStrictEqual(
	// 	JSON.stringify([['11\n'], ['01\n']])
	// );

	// expect(JSON.stringify(rejectedWriteStreamMock.mock.calls)).toStrictEqual(
	// 	JSON.stringify([['101\n'], ['111\n']])
	// );
});
