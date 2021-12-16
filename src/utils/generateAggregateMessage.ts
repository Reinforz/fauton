import colors from 'colors';
import { AutomatonTestInfo } from '../types';

function percentageUptoPrecision(numerator: number, denominator: number, precision: number) {
	return Number(((numerator / denominator) * 100).toFixed(precision));
}

function percentagesUptoPrecision(numerators: number[], denominator: number, precision: number) {
	return numerators.map((numerator) => percentageUptoPrecision(numerator, denominator, precision));
}

export function generateAggregateMessage(
	faLabel: string,
	faDescription: string | undefined,
	automatonTestInfo: AutomatonTestInfo
) {
	const { falsePositives, falseNegatives, truePositives, trueNegatives } = automatonTestInfo;
	const totalCorrect = trueNegatives + truePositives;
	const totalIncorrect = falseNegatives + falsePositives;
	const totalStrings = totalCorrect + totalIncorrect;
	const correctPercentage = percentageUptoPrecision(totalCorrect, totalStrings, 5);
	const incorrectPercentage = parseFloat((100 - correctPercentage).toFixed(5));
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

	const descriptionStringWithColors = faDescription ? `${colors.bold(faDescription)}\n` : '';
	const descriptionString = faDescription ? `${faDescription}\n` : '';
	return {
		values: {
			totalCorrect,
			totalIncorrect,
			totalStrings,
			correctPercentage,
			incorrectPercentage,
			falseNegativesPercentage,
			falsePositivesPercentage,
			truePositivesPercentage,
			trueNegativesPercentage,
		},
		withColors: [
			colors.blue.bold(faLabel),
			`${descriptionStringWithColors}Total: ${colors.blue.bold(totalStrings.toString())}\n`,
			`Incorrect: ${colors.red.bold(totalIncorrect.toString())}`,
			`Incorrect(%): ${colors.red.bold(`${incorrectPercentage.toString()}%`)}`,
			`False Positives: ${colors.red.bold(falsePositives.toString())}`,
			`False Positives(%): ${colors.red.bold(`${falsePositivesPercentage}%`)}`,
			`False Negatives: ${colors.red.bold(falseNegatives.toString())}`,
			`False Negatives(%): ${colors.red.bold(`${falseNegativesPercentage}%`)}\n`,
			`Correct: ${colors.green.bold(totalCorrect.toString())}`,
			`Correct(%): ${colors.green.bold(`${correctPercentage.toString()}%`)}`,
			`True Positives: ${colors.green.bold(truePositives.toString())}`,
			`True Positives(%): ${colors.green.bold(`${truePositivesPercentage}%`)}`,
			`True Negatives: ${colors.green.bold(trueNegatives.toString())}`,
			`True Negatives(%): ${colors.green.bold(`${trueNegativesPercentage}%`)}\n`,
		].join('\n'),
		withoutColors: [
			faLabel,
			`${descriptionString}Total: ${totalStrings}\n`,
			`Incorrect: ${totalIncorrect}`,
			`Incorrect(%): ${incorrectPercentage.toString()}%`,
			`False Positives: ${falsePositives.toString()}`,
			`False Positives(%): ${falsePositivesPercentage}%`,
			`False Negatives: ${falseNegatives.toString()}`,
			`False Negatives(%): ${falseNegativesPercentage}%\n`,
			`Correct: ${totalCorrect}`,
			`Correct(%): ${correctPercentage.toString()}%`,
			`True Positives: ${truePositives.toString()}`,
			`True Positives(%): ${truePositivesPercentage}%`,
			`True Negatives: ${trueNegatives.toString()}`,
			`True Negatives(%): ${trueNegativesPercentage}%\n`,
		].join('\n'),
	};
}
