import colors from 'colors';

export default function generateAggregateMessage(
	totalCorrect: number,
	totalIncorrect: number,
	dfaLabel: string,
	totalStrings: number
) {
	return {
		withColors: [
			colors.blue.bold(dfaLabel),
			`Failed: ` + colors.red.bold(totalIncorrect.toString()),
			`Correct: ` + colors.green.bold(totalCorrect.toString()),
			`Correct(%): ` +
				colors.green.bold(((totalCorrect / totalStrings) * 100).toFixed(2) + '%') +
				'\n',
		].join('\n'),
		withoutColors: [
			dfaLabel,
			`Failed: ` + totalIncorrect,
			`Correct: ` + totalCorrect,
			`Correct(%): ` + ((totalCorrect / totalStrings) * 100).toFixed(2) + '%' + '\n',
		].join('\n'),
	};
}
