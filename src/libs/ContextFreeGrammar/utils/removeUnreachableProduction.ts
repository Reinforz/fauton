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
): Pick<CFGOption, 'productionRules' | 'variables'> {
	const { productionRules, startVariable, variables } = cfgOption;

	const copiedProductionRules = JSON.parse(
		JSON.stringify(productionRules)
	) as CFGOption['productionRules'];

	const variablesSet = new Set(variables);
	const unvisitedVariables = new LinkedList<string>();
	unvisitedVariables.insertFirst(startVariable);
	const visitedVariables = new Set(startVariable);

	// While we have unvisited variables
	while (unvisitedVariables.count()) {
		const unvisitedVariable = unvisitedVariables.removeFirst();
		// For each of the unvisited variable, check which variables we can reach
		productionRules[unvisitedVariable.getValue()].forEach((productionRule) => {
			for (let index = 0; index < productionRule.length; index += 1) {
				const productionRuleLetter = productionRule[index];
				// If the letter is a variable, and we haven't visited the variable yet
				if (variablesSet.has(productionRuleLetter) && !visitedVariables.has(productionRuleLetter)) {
					visitedVariables.add(productionRuleLetter);
					unvisitedVariables.insertLast(productionRuleLetter);
				}
			}
		});
	}
	// The difference between the variables set and visited variables set will return the variables which couldn't be reached
	const nonReachableVariables = Array.from(setDifference(variablesSet, visitedVariables));
	// Delete the production rules for each of the unreachable variables
	nonReachableVariables.forEach((nonReachableVariable) => {
		delete copiedProductionRules[nonReachableVariable];
	});

	return {
		variables: Array.from(visitedVariables),
		productionRules: copiedProductionRules,
	};
}
