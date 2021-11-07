import colors from 'colors';

export default function generateAggregateMessage(
	totalCorrect: number,
	totalIncorrect: number,
	dfaLabel: string,
	totalStrings: number
) {
	const correctPercentage = Number(((totalCorrect / totalStrings) * 100).toFixed(5));
	const incorrectPercentage = (100 - correctPercentage).toFixed(5);
	return {
		withColors: [
			colors.blue.bold(dfaLabel),
			`Total: ` + colors.blue.bold((totalIncorrect + totalCorrect).toString()),
			`Incorrect: ` + colors.red.bold(totalIncorrect.toString()),
			`Incorrect(%): ` + colors.red.bold(incorrectPercentage.toString() + '%'),
			`Correct: ` + colors.green.bold(totalCorrect.toString()),
			`Correct(%): ` + colors.green.bold(correctPercentage.toString() + '%') + '\n',
		].join('\n'),
		withoutColors: [
			dfaLabel,
			`Total: ` + totalIncorrect + totalCorrect,
			`Incorrect: ` + totalIncorrect,
			`Incorrect(%): ` + incorrectPercentage.toString() + '%',
			`Correct: ` + totalCorrect,
			`Correct(%): ` + correctPercentage + '%' + '\n',
		].join('\n'),
	};
}
