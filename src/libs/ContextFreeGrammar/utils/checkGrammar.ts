import { CFGOption, LanguageChecker } from '../../../types';
import { generateAggregateMessage, setDifference } from '../../../utils';
import { createFileWriteStreams } from '../../AutomataTest/utils/createFileWriteStreams';
import { GenerateString } from '../../GenerateString';
import { validateCfg } from './validateCfg';

export async function checkGrammar(
	languageChecker: LanguageChecker,
	cfgOption: CFGOption,
	maxLength: number,
	outputDirectory: string
) {
	validateCfg(cfgOption);
	const universalLanguage = GenerateString.generateAllCombosWithinLength(
		cfgOption.terminals,
		maxLength,
		0
	);

	const grammarLanguage = GenerateString.generateCfgLanguage(cfgOption, maxLength);
	// Sort the grammar language based on its length
	const grammarLanguageStrings = Object.keys(grammarLanguage).sort(
		(stringA, stringB) => stringA.length - stringB.length
	);

	// TODO: Take in automaton label
	const { record, endStreams } = createFileWriteStreams(outputDirectory, 'label', {
		accepted: true,
		input: true,
		aggregate: true,
		case: true,
		incorrect: true,
	});

	// Input would be the concatenation of actual language and cfg language
	const inputStrings = Array.from(new Set(grammarLanguageStrings.concat(actualLanguage)));
	inputStrings.forEach((inputString, inputStringIndex) => {
		record.inputWriteStream!.write(
			`${inputString}${inputStringIndex !== inputStrings.length - 1 ? '\n' : ''}`
		);
	});

	const falsePositives = grammarLanguageStrings.filter((string) => !languageChecker(string));
	// These strings exist in our cfg but not in our actual language
	if (falsePositives.length) {
		falsePositives.forEach((falsePositiveString, falsePositiveStringIndex) => {
			record.incorrectWriteStream!.write(
				`T F ${falsePositiveString}${
					falsePositiveStringIndex !== falsePositives.length - 1 ? '\n' : ''
				}`
			);
		});
	}

	const languageDifference = setDifference(
		new Set(actualLanguage),
		new Set(grammarLanguageStrings)
	);
	if (languageDifference.size) {
		const isFalseNegative = languageDifference.size > 0;

		languageDifference.forEach((string) => {
			record.incorrectWriteStream!.write(`${isFalseNegative ? 'T F' : 'F T'} ${string}`);
		});
	}
	const { withColors, withoutColors } = generateAggregateMessage(undefined, undefined, {
		falseNegatives: languageDifference.size,
		falsePositives: falsePositives.length,
		trueNegatives: 0,
		truePositives: actualLanguage.length,
	});
	record.aggregateWriteStream!.write(withoutColors);
	endStreams();
	console.log(withColors);
}
