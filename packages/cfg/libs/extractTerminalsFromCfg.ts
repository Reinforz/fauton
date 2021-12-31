import { IContextFreeGrammarInput } from './types';

/**
 * Extract terminals from cfg rules
 * @param cfg Cfg object
 * @returns An array of terminals
 */
export function extractTerminalsFromCfg(
	inputCfg: Omit<IContextFreeGrammarInput, 'terminals' | 'startVariable'>
) {
	if (!inputCfg.variables) {
		inputCfg.variables = Object.keys(inputCfg);
	}
	const terminals: string[] = [];
	// Creating a set of variables initially to improve search performance
	const variablesSet = new Set(inputCfg.variables);

	Object.values(inputCfg.productionRules).forEach((rules) => {
		rules.forEach((rule) => {
			const tokens = rule.split(' ');
			// Loop through each of the tokens to see which of them are terminals
			tokens.forEach((token) => {
				// If the token is not a variable and not empty string, its a terminal
				if (!variablesSet.has(token) && token) {
					terminals.push(token);
				}
			});
		});
	});
	return Array.from(new Set(terminals));
}
