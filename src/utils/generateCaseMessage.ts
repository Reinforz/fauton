import colors from 'colors';

export default function generateCaseMessage(
	isWrong: boolean,
	randomInputString: string,
	dfaTestResult: boolean,
	logicTestResult: boolean
) {
	return {
		withColors: `${[
			`Result: ${isWrong ? colors.red.bold(`WRONG`) : colors.green.bold(`CORRECT`)}`,
			`String: ${colors.yellow.bold(randomInputString)}`,
			`Logic: ${colors.blue.bold(logicTestResult.toString())}`,
			`DFA: ${colors.blue.bold(dfaTestResult.toString())}`,
		].join('\n')}\n`,
		withoutColors: `${[
			`Result: ${isWrong ? `WRONG` : `CORRECT`}`,
			`String: ${randomInputString}`,
			`Logic: ${logicTestResult}`,
			`DFA: ${dfaTestResult}`,
		].join('\n')}\n`,
	};
}
