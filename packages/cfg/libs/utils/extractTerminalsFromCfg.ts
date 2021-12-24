import { IContextFreeGrammar } from '../types';

/**
 * Extract terminals from cfg rules
 * @param cfg Cfg object
 * @returns An array of terminals
 */
export function extractTerminalsFromCfg(cfg: IContextFreeGrammar) {
	const terminals: string[] = [];
	// Creating a set of variables initially to improve search performance
	const variablesSet = new Set(cfg.variables);

	Object.values(cfg.productionRules).forEach((rules) => {
		rules.forEach((rule) => {
			const tokens = rule.split(' ');
			// Loop through each of the tokens to see which of them are terminals
			tokens.forEach((token) => {
				// If the token is not a variable, its a terminal
				if (!variablesSet.has(token)) {
					terminals.push(token);
				}
			});
		});
	});
	return Array.from(new Set(terminals));
}
