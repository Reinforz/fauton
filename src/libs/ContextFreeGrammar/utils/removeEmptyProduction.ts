import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils/setDifference';

/**
 * Removes empty production variables and updates rules to remove those rules that references empty production variables
 * @param cfgOption Variables array and production rules record of cfg
 * @returns New production rules and variables without empty rule variables
 */
export function removeEmptyProduction(cfgOption: Pick<CFGOption, 'variables' | 'productionRules'>) {
	const { productionRules, variables } = cfgOption;
	// Filtering all the variables which dont have any production rules
	const emptyProductionVariables = variables.filter(
		(variable) => productionRules[variable].length === 0
	);
	// Remove empty production variables from the production rules record
	emptyProductionVariables.forEach((emptyProductionVariable) => {
		delete productionRules[emptyProductionVariable];
	});

	// Now we need to remove all the production rules that references any empty production variables
	Object.entries(productionRules).forEach(([productionVariable, productionRulesSubstitutions]) => {
		productionRules[productionVariable] = productionRulesSubstitutions.filter(
			(productionRulesSubstitution) =>
				!emptyProductionVariables.some(
					(emptyProductionVariable) =>
						!productionRulesSubstitution.includes(emptyProductionVariable)
				)
		);
	});

	return {
		productionRules,
		// Returning a new set of variables without the empty rules one
		variables: setDifference(new Set(variables), new Set(emptyProductionVariables)),
	};
}
