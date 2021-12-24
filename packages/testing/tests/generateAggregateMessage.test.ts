import { generateAggregateMessage } from '../libs/utils/generateAggregateMessage';

it(`Should generate correct aggregate message values`, () => {
	const { values } = generateAggregateMessage('dfa', undefined, {
		falseNegatives: 5,
		falsePositives: 10,
		trueNegatives: 50,
		truePositives: 25,
	});
	expect(values).toStrictEqual({
		totalCorrect: 75,
		totalIncorrect: 15,
		totalStrings: 90,
		correctPercentage: 83.33333,
		incorrectPercentage: 16.66667,
		falsePositivesPercentage: 11.11111,
		falseNegativesPercentage: 5.55556,
		truePositivesPercentage: 27.77778,
		trueNegativesPercentage: 55.55556,
	});

	// To cover case where description is present and label is not present
	generateAggregateMessage(undefined, 'dfa description', {
		falseNegatives: 5,
		falsePositives: 10,
		trueNegatives: 50,
		truePositives: 25,
	});
});
