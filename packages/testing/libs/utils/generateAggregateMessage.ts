import colors from 'colors';
import { AutomatonTestInfo } from '../types';

function percentageUptoPrecision(numerator: number, denominator: number, precision: number) {
	return Number(((numerator / denominator) * 100).toFixed(precision));
}

function percentagesUptoPrecision(numerators: number[], denominator: number, precision: number) {
	return numerators.map((numerator) => percentageUptoPrecision(numerator, denominator, precision));
}

/**
 * Generate aggregate message for an automaton
 * @param automatonLabel Label given to the automaton
 * @param automatonDescription Description of the automaton
 * @param automatonTestInfo A record that contains the total false/true positive/negatives count for the automaton
 * @returns
 */
export function generateAggregateMessage(
	automatonLabel: string | undefined,
	automatonDescription: string | undefined,
	automatonTestInfo: AutomatonTestInfo
) {
	const { falsePositives, falseNegatives, truePositives, trueNegatives } = automatonTestInfo;
	// Its correct for both true positives and negatives
	const totalCorrect = trueNegatives + truePositives;
	// Its incorrect for both false positives and negatives
	const totalIncorrect = falseNegatives + falsePositives;

	// All input string would either be correct or incorrect
	const totalStrings = totalCorrect + totalIncorrect;
	const correctPercentage = percentageUptoPrecision(totalCorrect, totalStrings, 5);
	const incorrectPercentage = parseFloat((100 - correctPercentage).toFixed(5));
	// Get the percentage of false/true positive/negatives upto certain digit of precision
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

	// Add the automaton description with colors
	const descriptionStringWithColors = automatonDescription
		? `${colors.bold(automatonDescription)}\n`
		: '';
	const descriptionString = automatonDescription ? `${automatonDescription}\n` : '';
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
			colors.blue.bold(automatonLabel ?? ''),
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
			automatonLabel,
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
