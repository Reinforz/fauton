import { IContextFreeGrammar } from '../types';
import { setDifference } from './setOperations';

export function removeProductionRules(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables'> & {
		removedVariables: string[];
	}
) {
	const { productionRules, removedVariables, variables } = cfg;
	// Remove production variables from the production rules record
	removedVariables.forEach((removedVariable) => {
		delete productionRules[removedVariable];
	});
	const removedVariablesSet = new Set(removedVariables);

	// Now we need to remove all the production rules that references any removed production variables
	Object.entries(productionRules).forEach(([productionVariable, productionRulesSubstitutions]) => {
		productionRules[productionVariable] = productionRulesSubstitutions.filter(
			(productionRulesSubstitution) => {
				// productionRulesSubstitution = Verb Adj Noun
				const productionRulesSubstitutionTokensSet = new Set(
					productionRulesSubstitution.split(' ')
				);
				const difference = setDifference(productionRulesSubstitutionTokensSet, removedVariablesSet);
				// If we dont need to remove any variables then the size before and after the set difference would be similar
				return difference.size === productionRulesSubstitutionTokensSet.size;
			}
		);
	});

	return Array.from(setDifference(new Set(variables), new Set(removedVariables)));
}
