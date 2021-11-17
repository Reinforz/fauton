import colors from 'colors';

export function generateCaseMessage(
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
			`FA: ${colors.blue.bold(dfaTestResult.toString())}`,
		].join('\n')}\n`,
		withoutColors: `${[
			`Result: ${isWrong ? `WRONG` : `CORRECT`}`,
			`String: ${randomInputString}`,
			`Logic: ${logicTestResult}`,
			`FA: ${dfaTestResult}`,
		].join('\n')}\n`,
	};
}
