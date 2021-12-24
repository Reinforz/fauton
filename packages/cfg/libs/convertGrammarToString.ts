import { IContextFreeGrammar } from './types';

/**
 * Convert a cfg to its string representation
 * @param productionRules Production rules record
 * @returns A string corresponding to the cfg rules
 */
export function convertGrammarToString(productionRules: IContextFreeGrammar['productionRules']) {
	let grammarString = '';
	const productionRulesEntries = Object.entries(productionRules);
	productionRulesEntries.forEach(([variable, rules], productionRulesIndex) => {
		// Don't add newline if we are at the last rule
		grammarString += `${variable} -> ${rules.join(' | ')}${
			productionRulesIndex !== productionRulesEntries.length - 1 ? '\n' : ''
		}`;
	});
	return grammarString;
}
