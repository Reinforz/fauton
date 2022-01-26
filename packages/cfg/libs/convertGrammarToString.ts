import { IContextFreeGrammar } from './types';

/**
 * Convert a cfg to its string representation
 * @param productionRules Production rules record
 * @returns A string corresponding to the cfg rules
 */
export function convertGrammarToString(productionRules: IContextFreeGrammar['productionRules']) {
	const grammarStringLines: string[] = [];
	const productionRulesEntries = Object.entries(productionRules);
	productionRulesEntries.forEach(([variable, rules]) => {
		grammarStringLines.push(
			`${variable} -> ${rules.map((rule) => (rule.length === 0 ? 'ϵ' : rule)).join(' | ')}`
		);
	});
	return grammarStringLines;
}
