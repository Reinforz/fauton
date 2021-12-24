/* eslint-disable no-param-reassign, no-unused-vars */
import fs from 'fs';
import { AutomatonTestInfo, IAutomatonTestFn, IAutomatonTestLogicFn, IOutputFiles } from '../types';
import { generateCaseMessage } from './generateCaseMessage';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

export function testAutomaton(
	automatonTest: {
		test: IAutomatonTestFn;
		testLogic: IAutomatonTestLogicFn;
	},
	automatonTestInfo: AutomatonTestInfo,
	writeStreams: IWriteStreams,
	inputStrings: string[],
	postAutomatonTestCb?: () => void
) {
	// The log files are generated based on the label of the automaton
	const {
		caseWriteStream,
		correctWriteStream,
		acceptedWriteStream,
		rejectedWriteStream,
		incorrectWriteStream,
		inputWriteStream,
	} = writeStreams;

	for (let i = 0; i < inputStrings.length; i += 1) {
		const inputString = inputStrings[i].replace('\r', '').replace('\n', '');
		if (inputString.length !== 0) {
			const automatonTestResult = automatonTest.test(inputString);
			const logicTestResult = automatonTest.testLogic(inputString, automatonTestResult);
			const isWrong = automatonTestResult !== logicTestResult;

			const testResultString = `${automatonTestResult.toString().toUpperCase()[0]} ${
				logicTestResult.toString().toUpperCase()[0]
			} ${inputString} \n`;
			if (!automatonTestResult && rejectedWriteStream) {
				rejectedWriteStream.write(`${inputString}\n`);
			} else if (acceptedWriteStream) {
				acceptedWriteStream.write(`${inputString}\n`);
			}
			if (!isWrong && correctWriteStream) {
				if (automatonTestResult === false && logicTestResult === false) {
					automatonTestInfo.trueNegatives += 1;
				} else {
					automatonTestInfo.truePositives += 1;
				}
				correctWriteStream.write(testResultString);
			} else if (incorrectWriteStream) {
				if (automatonTestResult && !logicTestResult) {
					automatonTestInfo.falsePositives += 1;
				} else {
					automatonTestInfo.falseNegatives += 1;
				}
				incorrectWriteStream.write(testResultString);
			}
			if (inputWriteStream) {
				inputWriteStream.write(`${inputString}\n`);
			}

			const { withoutColors } = generateCaseMessage(
				isWrong,
				inputString,
				automatonTestResult,
				logicTestResult
			);
			if (caseWriteStream) caseWriteStream.write(`${withoutColors}\n`);
			if (postAutomatonTestCb) {
				postAutomatonTestCb();
			}
		}
	}
}
