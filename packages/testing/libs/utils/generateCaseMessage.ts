import colors from 'colors';

export function generateCaseMessage(
	isWrong: boolean,
	randomInputString: string,
	dfaTestResult: boolean,
	logicTestResult: boolean
) {
	return {
		withColors: `${[
			`V: ${isWrong ? colors.red.bold(`WRONG`) : colors.green.bold(`CORRECT`)}`,
			`I: ${colors.yellow.bold(randomInputString)}`,
			`L: ${colors.blue.bold(logicTestResult.toString())}`,
			`A: ${colors.blue.bold(dfaTestResult.toString())}`,
		].join('\n')}\n`,
		withoutColors: `${[
			`V: ${isWrong ? `WRONG` : `CORRECT`}`,
			`I: ${randomInputString}`,
			`L: ${logicTestResult}`,
			`A: ${dfaTestResult}`,
		].join('\n')}\n`,
	};
}
