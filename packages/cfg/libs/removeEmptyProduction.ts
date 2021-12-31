import { IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';
import { removeProductionRules } from './utils/removeProductionRules';

/**
 * Removes productions that has no rules and updates rules to remove those rules that references empty production variables
 * @param cfg Variables array and production rules record of cfg
 * @returns New production rules and variables without empty rule variables
 */
export function removeEmptyProduction(
	inputCfg: Pick<IContextFreeGrammarInput, 'variables' | 'productionRules'>
) {
	const cfg = populateCfg(inputCfg);
	const { productionRules, variables } = cfg;
	// Filtering all the variables which dont have any production rules
	const emptyProductionVariables = variables.filter(
		(variable) => productionRules[variable].length === 0
	);
	return removeProductionRules({
		productionRules,
		removedVariables: emptyProductionVariables,
		variables,
	});
}
