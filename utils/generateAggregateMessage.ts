import colors from 'colors';

export default function generateAggregateMessage(
	totalCorrect: number,
	totalIncorrect: number,
	dfaLabel: string,
	totalStrings: number,
	falsePositives: number,
	falseNegatives: number
) {
	const correctPercentage = Number(((totalCorrect / totalStrings) * 100).toFixed(5));
	const incorrectPercentage = (100 - correctPercentage).toFixed(5);
	const falsePositivesPercentage = Number(((falsePositives / totalStrings) * 100).toFixed(5));
	const falseNegativesPercentage = Number(((falseNegatives / totalStrings) * 100).toFixed(5));
	return {
		withColors: [
			colors.blue.bold(dfaLabel),
			`Total: ` + colors.blue.bold((totalIncorrect + totalCorrect).toString()),
			`Incorrect: ` + colors.red.bold(totalIncorrect.toString()),
			`Incorrect(%): ` + colors.red.bold(incorrectPercentage.toString() + '%'),
			`False Positives: ` + colors.red.bold(falsePositives.toString()),
			`False Positives(%): ` + colors.red.bold(falsePositivesPercentage + '%'),
			`False Negatives: ` + colors.red.bold(falseNegatives.toString()),
			`False Negatives(%): ` + colors.red.bold(falseNegativesPercentage + '%'),
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
