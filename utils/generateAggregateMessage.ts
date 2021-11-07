import colors from 'colors';

function percentageUptoPrecision(numerator: number, denominator: number, precision: number) {
	return Number(((numerator / denominator) * 100).toFixed(precision));
}

function percentagesUptoPrecision(numerators: number[], denominator: number, precision: number) {
	return numerators.map((numerator) => percentageUptoPrecision(numerator, denominator, precision));
}

export default function generateAggregateMessage(
	dfaLabel: string,
	falsePositives: number,
	falseNegatives: number,
	truePositives: number,
	trueNegatives: number
) {
	const totalCorrect = trueNegatives + truePositives;
	const totalIncorrect = falseNegatives + falsePositives;
	const totalStrings = totalCorrect + totalIncorrect;
	const correctPercentage = percentageUptoPrecision(totalCorrect, totalStrings, 5);
	const incorrectPercentage = (100 - correctPercentage).toFixed(5);
	const [
		falsePositivesPercentage,
		falseNegativesPercentage,
		truePositivesPercentage,
		trueNegativesPercentage,
	] = percentagesUptoPrecision(
		[falsePositives, falseNegatives, truePositives, trueNegatives],
		totalStrings,
		5
	);

	return {
		withColors: [
			colors.blue.bold(dfaLabel),
			`Total: ` + colors.blue.bold(totalStrings.toString()) + '\n',
			`Incorrect: ` + colors.red.bold(totalIncorrect.toString()),
			`Incorrect(%): ` + colors.red.bold(incorrectPercentage.toString() + '%'),
			`False Positives: ` + colors.red.bold(falsePositives.toString()),
			`False Positives(%): ` + colors.red.bold(falsePositivesPercentage + '%'),
			`False Negatives: ` + colors.red.bold(falseNegatives.toString()),
			`False Negatives(%): ` + colors.red.bold(falseNegativesPercentage + '%') + '\n',
			`Correct: ` + colors.green.bold(totalCorrect.toString()),
			`Correct(%): ` + colors.green.bold(correctPercentage.toString() + '%'),
			`True Positives: ` + colors.green.bold(truePositives.toString()),
			`True Positives(%): ` + colors.green.bold(truePositivesPercentage + '%'),
			`True Negatives: ` + colors.green.bold(trueNegatives.toString()),
			`True Negatives(%): ` + colors.green.bold(trueNegativesPercentage + '%') + '\n',
		].join('\n'),
		withoutColors: [
			dfaLabel,
			`Total: ` + totalStrings + '\n',
			`Incorrect: ` + totalIncorrect,
			`Incorrect(%): ` + incorrectPercentage.toString() + '%',
			`False Positives: ` + falsePositives.toString(),
			`False Positives(%): ` + falsePositivesPercentage + '%',
			`False Negatives: ` + falseNegatives.toString(),
			`False Negatives(%): ` + falseNegativesPercentage + '%' + '\n',
			`Correct: ` + totalCorrect,
			`Correct(%): ` + correctPercentage.toString() + '%',
			`True Positives: ` + truePositives.toString(),
			`True Positives(%): ` + truePositivesPercentage + '%',
			`True Negatives: ` + trueNegatives.toString(),
			`True Negatives(%): ` + trueNegativesPercentage + '%' + '\n',
		].join('\n'),
	};
}
