import { CFGOption, LanguageChecker } from '../../../types';
import { generateAggregateMessage, setDifference } from '../../../utils';
import { GenerateString } from '../../GenerateString';
import { validateCfg } from './validateCfg';

export function checkGrammar(
	languageChecker: LanguageChecker,
	cfgOption: CFGOption,
	maxLength: number
) {
	validateCfg(cfgOption);
	const actualLanguage = GenerateString.generateAllCombosWithinLength(
		cfgOption.terminals,
		maxLength,
		0,
		languageChecker
	);
	const grammarLanguage = GenerateString.generateCfgLanguage(cfgOption, maxLength);
	const grammarLanguageStrings = Object.keys(grammarLanguage).sort(
		(stringA, stringB) => stringA.length - stringB.length
	);
	const falsePositives = grammarLanguageStrings.filter((string) => !languageChecker(string));
	// These strings exist in our cfg but not in our actual language
	if (falsePositives.length) {
		console.log('False positives');
		falsePositives.forEach((falsePositive) => {
			console.log(falsePositive);
		});
	} else {
		console.log('All words in cfg language are legal');
	}

	const difference = setDifference(new Set(actualLanguage), new Set(grammarLanguageStrings));
	if (difference.size) {
		console.log();
		if (difference.size > 0) {
			console.log('False negatives');
		} else if (difference.size < 0) {
			console.log('False positives');
		}
		difference.forEach((word) => {
			console.log(word);
		});
	} else {
		console.log('CFG represents the actual language');
	}
	const { withColors } = generateAggregateMessage(undefined, undefined, {
		falseNegatives: difference.size,
		falsePositives: falsePositives.length,
		trueNegatives: 0,
		truePositives: actualLanguage.length,
	});
	console.log(withColors);
}
