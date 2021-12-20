import { IContextFreeGrammar } from '../../../types';
import { setDifference } from '../../../utils/setDifference';

export function removeProductionRules(
	cfgGrammar: Pick<IContextFreeGrammar, 'productionRules' | 'variables'> & {
		removedVariables: string[];
	}
) {
	const { productionRules, removedVariables, variables } = cfgGrammar;
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
				const productionRulesSubstitutionChunksSet = new Set(
					productionRulesSubstitution.split(' ')
				);
				const difference = setDifference(productionRulesSubstitutionChunksSet, removedVariablesSet);
				// If we dont need to remove any variables then the size before and after the set difference would be similar
				return difference.size === productionRulesSubstitutionChunksSet.size;
			}
		);
	});

	return Array.from(setDifference(new Set(variables), new Set(removedVariables)));
}
