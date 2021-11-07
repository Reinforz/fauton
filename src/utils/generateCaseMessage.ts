import colors from 'colors';

export default function generateCaseMessage(
	isWrong: boolean,
	randomBinaryString: string,
	dfaTestResult: boolean,
	logicTestResult: boolean
) {
	return {
		withColors:
			[
				'Result: ' + (isWrong ? colors.red.bold(`WRONG`) : colors.green.bold(`CORRECT`)),
				'String: ' + colors.yellow.bold(randomBinaryString),
				'Logic: ' + colors.blue.bold(logicTestResult.toString()),
				'DFA: ' + colors.blue.bold(dfaTestResult.toString()),
			].join('\n') + '\n',
		withoutColors:
			[
				'Result: ' + (isWrong ? `WRONG` : `CORRECT`),
				'String: ' + randomBinaryString,
				'Logic: ' + logicTestResult,
				'DFA: ' + dfaTestResult,
			].join('\n') + '\n',
	};
}
