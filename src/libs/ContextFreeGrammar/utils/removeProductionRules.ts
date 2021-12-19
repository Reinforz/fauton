import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils/setDifference';

export function removeProductionRules(
	cfgOption: Pick<CFGOption, 'productionRules' | 'variables'> & { removedVariables: string[] }
) {
	const { productionRules, removedVariables, variables } = cfgOption;
	// Remove production variables from the production rules record
	removedVariables.forEach((removedVariable) => {
		delete productionRules[removedVariable];
	});

	// Now we need to remove all the production rules that references any removed production variables
	Object.entries(productionRules).forEach(([productionVariable, productionRulesSubstitutions]) => {
		productionRules[productionVariable] = productionRulesSubstitutions.filter(
			(productionRulesSubstitution) =>
				removedVariables.every(
					(removedVariable) => !productionRulesSubstitution.includes(removedVariable)
				)
		);
	});

	return Array.from(setDifference(new Set(variables), new Set(removedVariables)));
}
