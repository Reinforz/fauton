import { LinkedList } from '@datastructures-js/linked-list';
import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils';

/**
 * Removes unreachable variables and production of a cfg
 * @param cfgOption Production rules, start variable and variables array of cfg
 * @returns A new production rule record and variables with unreachable variable and rules removed
 */
export function removeUnreachableProduction(
	cfgOption: Pick<CFGOption, 'productionRules' | 'startVariable' | 'variables'>
) {
	const { productionRules, startVariable, variables } = cfgOption;

	const variablesSet = new Set(variables);
	const unvisitedVariables = new LinkedList<string>();
	unvisitedVariables.insertFirst(startVariable);
	const visitedVariables: Set<string> = new Set();
	visitedVariables.add(startVariable);

	// While we have unvisited variables
	while (unvisitedVariables.count()) {
		const unvisitedVariable = unvisitedVariables.removeFirst();
		// For each of the unvisited variable, check which variables we can reach
		productionRules[unvisitedVariable.getValue()].forEach((productionRuleSubstitution) => {
			const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
			for (
				let productionRuleSubstitutionChunksIndex = 0;
				productionRuleSubstitutionChunksIndex < productionRuleSubstitutionChunks.length;
				productionRuleSubstitutionChunksIndex += 1
			) {
				const productionRuleSubstitutionChunk =
					productionRuleSubstitutionChunks[productionRuleSubstitutionChunksIndex];
				// If the letter is a variable, and we haven't visited the variable yet
				if (
					variablesSet.has(productionRuleSubstitutionChunk) &&
					!visitedVariables.has(productionRuleSubstitutionChunk)
				) {
					visitedVariables.add(productionRuleSubstitutionChunk);
					unvisitedVariables.insertLast(productionRuleSubstitutionChunk);
				}
			}
		});
	}
	// The difference between the variables set and visited variables set will return the variables which couldn't be reached
	const nonReachableVariables = Array.from(setDifference(variablesSet, visitedVariables));
	// Delete the production rules for each of the unreachable variables
	nonReachableVariables.forEach((nonReachableVariable) => {
		delete productionRules[nonReachableVariable];
	});
	// There is no need to update the production rules as unreachable variables are not referenced there
	return Array.from(visitedVariables);
}
