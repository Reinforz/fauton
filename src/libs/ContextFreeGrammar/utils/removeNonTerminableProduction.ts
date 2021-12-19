import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils/setDifference';
import { isAllTerminal } from './isAllTerminal';
import {} from './removeEmptyProduction';
import { removeProductionRules } from './removeProductionRules';

/* eslint-disable no-loop-func */

/**
 * Removes production rules which doesn't derive any terminals or terminable variables
 * @param cfgOption terminals, variables and production rules of cfg
 * @returns An array of variables that are all terminable
 */
export function removeNonTerminableProduction(cfgOption: Omit<CFGOption, 'startVariable'>) {
	const { terminals, variables, productionRules } = cfgOption;

	// A set to keep track of variables which are terminable, ie we can reach a terminal from these variables
	// Initialize it with variables that derives only terminals in any of its production rules
	let terminableVariables: Set<string> = new Set(
		variables.filter((variable) =>
			productionRules[variable].some((productionRule) => isAllTerminal(terminals, productionRule))
		)
	);
	const variablesSet = new Set(variables);
	let done = false;

	// Check if any of the variable in the word is terminable or not
	function checkAnyVariableIsTerminable(nonTerminableVariable: string) {
		return productionRules[nonTerminableVariable].some((word) => {
			// Extracting variables from word
			const variablesFromWord = word.split('').filter((letter) => variablesSet.has(letter));
			// Checking if all the extracted variables are terminable
			return variablesFromWord.every((variable) => terminableVariables.has(variable));
		});
	}

	while (!done) {
		done = true;
		// Creating a set of temporary terminal variables set to replace later
		const tempTerminableVariables = new Set(Array.from(terminableVariables));
		// Current non terminable variables
		const nonTerminableVariables = setDifference(variablesSet, terminableVariables);
		nonTerminableVariables.forEach((nonTerminableVariable) => {
			// Check if any of the variables from the words are terminable or not
			const isAnyVariableTerminable = checkAnyVariableIsTerminable(nonTerminableVariable);
			// The variable is terminable if:-
			// Any of the words of the production rules contain only terminals for example ["ab", "AB"]
			// Or the word contains only terminable variables
			if (isAnyVariableTerminable) {
				// Set the done flag to false, as we need to check other variables which references this one to check whether they are terminal or not
				done = false;
				tempTerminableVariables.add(nonTerminableVariable);
			}
		});
		// Update the current terminable variables set with the temp one
		terminableVariables = tempTerminableVariables;
	}

	return removeProductionRules({
		productionRules,
		variables,
		removedVariables: Array.from(setDifference(variablesSet, terminableVariables)),
	});
}