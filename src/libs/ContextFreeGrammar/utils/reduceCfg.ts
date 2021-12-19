import { CFGOption } from '../../../types';
import { removeNonTerminableProduction } from './removeNonTerminableProduction';
import { removeUnreachableProduction } from './removeUnreachableProduction';

/**
 * Reduces an input cfg by removing non terminable and non reachable variables
 * @param cfgOption Variables, start symbol and production rules of a cfg
 * @returns An array of terminable and reachable variables
 */
export function reduceCfg(cfgOption: CFGOption) {
	const updatedVariables = removeNonTerminableProduction(cfgOption);
	return removeUnreachableProduction({
		...cfgOption,
		variables: updatedVariables,
	});
}
