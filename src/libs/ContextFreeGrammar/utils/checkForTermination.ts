import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils/setDifference';
import { isAllTerminal } from './isAllTerminal';

/* eslint-disable no-loop-func */

/**
 * Checks if all the production rules of a cfg are terminable
 * @param cfgOption terminals, variables and production rules of cfg
 * @returns True if all production rules are terminable, false otherwise
 */
export function checkForTermination(cfgOption: Omit<CFGOption, 'startVariable'>) {
	const { terminals, variables, productionRules } = cfgOption;

	// A set to keep track of variables which are terminable, ie we can reach a terminal from these variables
	let terminableVariables: Set<string> = new Set();
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
			// Check if some of the words contains only terminals
			const doesSomeWordContainOnlyTerminals = productionRules[nonTerminableVariable].some(
				(substitutedWord) => isAllTerminal(terminals, substitutedWord)
			);
			// Check if any of the variables from the words are terminable or not
			const isAnyVariableTerminable =
				doesSomeWordContainOnlyTerminals || checkAnyVariableIsTerminable(nonTerminableVariable);
			// The variable is terminable if:-
			// Any of the words of the production rules contain only terminals for example ["ab", "AB"]
			// Or the word contains only terminable variables
			if (doesSomeWordContainOnlyTerminals || isAnyVariableTerminable) {
				// Set the done flag to false, as we need to check other variables which references this one to check whether they are terminal or not
				done = false;
				tempTerminableVariables.add(nonTerminableVariable);
			}
		});
		// Update the current terminable variables set with the temp one
		terminableVariables = tempTerminableVariables;
	}
	// If all the variables are not terminable then we have non terminable variables
	if (terminableVariables.size !== variablesSet.size) {
		return false;
		// return Array.from(setDifference(productRulesKeySet, terminableVariables));
	} else {
		return true;
	}
}
