import { CFGOption, LanguageChecker } from '../../../types';
import { test } from '../../AutomataTest/utils/test';
import { GenerateString } from '../../GenerateString';
import { validateCfg } from './validateCfg';

export async function checkGrammar(
	languageChecker: LanguageChecker,
	cfgOption: CFGOption,
	maxLength: number,
	logsPath: string
) {
	validateCfg(cfgOption);
	const grammarLanguage = GenerateString.generateCfgLanguage(cfgOption, maxLength);
	const grammarLanguageStrings = new Set(Object.keys(grammarLanguage));
	await test(logsPath, [
		{
			automaton: {
				alphabets: cfgOption.terminals,
				label: 'Label',
				test: (inputString) => grammarLanguageStrings.has(inputString),
				testLogic: languageChecker,
			},
			options: {
				type: 'generate',
				combo: {
					maxLength,
					startLength: 0,
				},
			},
		},
	]);
}
