import { IContextFreeGrammar } from '../../../types';
import { removeNonTerminableProduction } from './removeNonTerminableProduction';
import { removeUnreachableProduction } from './removeUnreachableProduction';

/**
 * Reduces an input cfg by removing non terminable and non reachable variables
 * @param cfgGrammar Variables, start symbol and production rules of a cfg
 * @returns An array of terminable and reachable variables
 */
export function removeUselessProduction(cfgGrammar: IContextFreeGrammar) {
	const updatedVariables = removeNonTerminableProduction(cfgGrammar);
	return removeUnreachableProduction({
		...cfgGrammar,
		variables: updatedVariables,
	});
}
