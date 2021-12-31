import { LinkedList } from '@datastructures-js/linked-list';
import { IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';
import { setDifference } from './utils/setOperations';

/**
 * Removes unreachable variables and production of a cfg
 * @param cfg Production rules, start variable and variables array of cfg
 * @returns A new production rule record and variables with unreachable variable and rules removed
 */
export function removeUnreachableProduction(
	inputCfg: Pick<IContextFreeGrammarInput, 'productionRules' | 'startVariable' | 'variables'>
) {
	const cfg = populateCfg(inputCfg);
	const { productionRules, startVariable, variables } = cfg;

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
			const tokens = productionRuleSubstitution.split(' ');
			for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
				const token = tokens[tokenIndex];
				// If the letter is a variable, and we haven't visited the variable yet
				if (variablesSet.has(token) && !visitedVariables.has(token)) {
					visitedVariables.add(token);
					unvisitedVariables.insertLast(token);
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
