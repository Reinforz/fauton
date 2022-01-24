/* eslint-disable no-param-reassign, no-unused-vars */
import fs from 'fs';
import { AutomatonTestInfo, IAutomatonTestFn, IAutomatonTestLogicFn, IOutputFiles } from '../types';
import { generateCaseMessage } from './generateCaseMessage';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

/**
 * Test an automaton against an array of input strings
 * @param automatonTest An object that contains two key, `test`: To test automaton, `testLogic`: to mimic the automaton using a function
 * @param automatonTestInfo A record containing aggregate information about automaton test result
 * @param writeStreams A record of write streams
 * @param inputStrings Input strings to test against the automaton
 * @param postAutomatonTestCb Callback called after testing the automaton, called for each input string
 */
export function testAutomaton(
	automatonTest: {
		test: IAutomatonTestFn;
		testLogic: IAutomatonTestLogicFn;
	},
	automatonTestInfo: AutomatonTestInfo,
	writeStreams: IWriteStreams,
	inputStrings: string[][],
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
		const inputTokens = inputStrings[i];
		if (inputTokens.length !== 0) {
			// Test the automaton
			const automatonTestResult = automatonTest.test(inputTokens);
			// Test the automaton emulator function
			const logicTestResult = automatonTest.testLogic(inputTokens, automatonTestResult);
			// If both the above result dont match, its wrong
			// either the automaton is wrong
			// you didn't emulate the automaton correctly
			const isWrong = automatonTestResult !== logicTestResult;
			// Input string would be formed by joining the input tokens
			const inputString = inputTokens.join(' ');

			// true => True => T, false => False => F
			// F T abc
			const testResultString = `${automatonTestResult.toString().toUpperCase()[0]} ${
				logicTestResult.toString().toUpperCase()[0]
			} ${inputString}\n`;
			// If the string didn't pass automaton test
			// then its not part of the automaton's language
			// Thus it should be rejected
			if (!automatonTestResult && rejectedWriteStream) {
				rejectedWriteStream.write(`${inputString}\n`);
			}
			// Otherwise the string is part of the automaton's language
			// And therefore it should be accepted
			else if (acceptedWriteStream) {
				acceptedWriteStream.write(`${inputString}\n`);
			}
			// If both the automaton and emulator gave the same result
			if (!isWrong && correctWriteStream) {
				// If both gave false, then increment true negatives
				if (automatonTestResult === false && logicTestResult === false) {
					automatonTestInfo.trueNegatives += 1;
				} else {
					// Else increment true positives
					automatonTestInfo.truePositives += 1;
				}
				// Write the input string to the correct stream
				correctWriteStream.write(testResultString);
			}
			// Otherwise if they gave different result
			else if (incorrectWriteStream) {
				// If automaton gave true but emulator gave false, then increment false positive
				if (automatonTestResult && !logicTestResult) {
					automatonTestInfo.falsePositives += 1;
				} else {
					// If automaton gave false but emulator gave true, then increment false negative
					automatonTestInfo.falseNegatives += 1;
				}
				// Write input string to incorrect stream
				incorrectWriteStream.write(testResultString);
			}
			// write all inputs to input stream
			if (inputWriteStream) {
				inputWriteStream.write(`${inputString}\n`);
			}

			// Generate case message for each input string
			const { withoutColors } = generateCaseMessage(
				isWrong,
				inputString,
				automatonTestResult,
				logicTestResult
			);
			if (caseWriteStream) caseWriteStream.write(`${withoutColors}\n`);
			// Call the post automaton test callback if present, called after testing against each input string
			if (postAutomatonTestCb) {
				postAutomatonTestCb();
			}
		}
	}
}
