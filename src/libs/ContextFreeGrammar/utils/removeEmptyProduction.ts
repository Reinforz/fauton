import { CFGOption } from '../../../types';
import { removeProductionRules } from './removeProductionRules';

/**
 * Removes productions that has no rules and updates rules to remove those rules that references empty production variables
 * @param cfgOption Variables array and production rules record of cfg
 * @returns New production rules and variables without empty rule variables
 */
export function removeEmptyProduction(cfgOption: Pick<CFGOption, 'variables' | 'productionRules'>) {
	const { productionRules, variables } = cfgOption;
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
