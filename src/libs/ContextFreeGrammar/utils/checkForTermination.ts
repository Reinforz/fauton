import { CFGOption } from '../../../types';
import { setDifference } from '../../../utils/setDifference';
import { isAllTerminal } from './isAllTerminal';

/* eslint-disable no-loop-func */

export function checkForTermination(cfgOption: Omit<CFGOption, 'startVariable'>) {
	const { terminals, variables, transitionRecord } = cfgOption;

	let terminableVariables: Set<string> = new Set();
	const transitionRecordKeySet = new Set(Object.keys(transitionRecord));
	const variablesSet = new Set(variables);
	let done = false;

	// Check if any of the variable in the word is terminable or not
	function checkAnyVariableIsTerminable(nonTerminableVariable: string) {
		return transitionRecord[nonTerminableVariable].some((word) => {
			// Extracting variables from word
			const variablesFromWord = word.split('').filter((letter) => variablesSet.has(letter));
			// Checking if all the extracted variables are terminable
			return variablesFromWord.every((variable) => terminableVariables.has(variable));
		});
	}

	while (!done) {
		done = true;
		const tempTerminableVariables = new Set(Array.from(terminableVariables));
		// Current non terminable variables
		const nonTerminableVariables = setDifference(transitionRecordKeySet, terminableVariables);
		nonTerminableVariables.forEach((nonTerminableVariable) => {
			// Check if some of the words contains only terminals
			const doesSomeWordContainOnlyTerminals = transitionRecord[nonTerminableVariable].some(
				(substitutedWord) => isAllTerminal(terminals, substitutedWord)
			);
			// Check if any of the variables from the words are terminable or not
			const isAnyVariableTerminable =
				doesSomeWordContainOnlyTerminals || checkAnyVariableIsTerminable(nonTerminableVariable);
			// If either of this is true, the variable is terminable
			if (doesSomeWordContainOnlyTerminals || isAnyVariableTerminable) {
				done = false;
				tempTerminableVariables.add(nonTerminableVariable);
			}
		});
		terminableVariables = tempTerminableVariables;
	}
	// return the variables that are not terminable
	if (terminableVariables.size !== transitionRecordKeySet.size) {
		return false;
		// return Array.from(setDifference(transitionRecordKeySet, terminableVariables));
	} else {
		return true;
	}
}
