import { removeNonTerminableProduction } from './removeNonTerminableProduction';
import { removeUnreachableProduction } from './removeUnreachableProduction';
import { IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';

/**
 * Reduces an input cfg by removing non terminable and non reachable variables
 * @param cfg Variables, start symbol and production rules of a cfg
 * @returns An array of terminable and reachable variables
 */
export function removeUselessProduction(inputCfg: IContextFreeGrammarInput) {
	const cfg = populateCfg(inputCfg);
	const terminableVariables = removeNonTerminableProduction(cfg);
	return removeUnreachableProduction({
		...cfg,
		variables: terminableVariables,
	});
}
