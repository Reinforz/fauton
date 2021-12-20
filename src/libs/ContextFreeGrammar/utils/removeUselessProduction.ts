import { IContextFreeGrammar } from '../../../types';
import { removeNonTerminableProduction } from './removeNonTerminableProduction';
import { removeUnreachableProduction } from './removeUnreachableProduction';

/**
 * Reduces an input cfg by removing non terminable and non reachable variables
 * @param cfg Variables, start symbol and production rules of a cfg
 * @returns An array of terminable and reachable variables
 */
export function removeUselessProduction(cfg: IContextFreeGrammar) {
	const updatedVariables = removeNonTerminableProduction(cfg);
	return removeUnreachableProduction({
		...cfg,
		variables: updatedVariables,
	});
}
