import colors from 'colors';

/**
 * Generate case message for each input string
 * @param isWrong Whether or not the case is wrong
 * @param inputString The input string that was used in the case
 * @param automataTestResult Verdict of the automata test for the input string
 * @param logicTestResult Verdict of the login test for the input string
 * @returns
 */
export function generateCaseMessage(
	isWrong: boolean,
	inputString: string,
	automataTestResult: boolean,
	logicTestResult: boolean
) {
	// Generate two strings both with and without colors
	// Coloured could be used inside a terminal
	// While non coloured could be used for storing to a file
	return {
		withColors: `${[
			`V: ${isWrong ? colors.red.bold(`WRONG`) : colors.green.bold(`CORRECT`)}`,
			`I: ${colors.yellow.bold(inputString)}`,
			`L: ${colors.blue.bold(logicTestResult.toString())}`,
			`A: ${colors.blue.bold(automataTestResult.toString())}`,
		].join('\n')}\n`,
		withoutColors: `${[
			`V: ${isWrong ? `WRONG` : `CORRECT`}`,
			`I: ${inputString}`,
			`L: ${logicTestResult}`,
			`A: ${automataTestResult}`,
		].join('\n')}\n`,
	};
}
