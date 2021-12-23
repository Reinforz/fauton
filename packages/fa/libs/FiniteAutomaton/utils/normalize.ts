/* eslint-disable no-param-reassign */
import { InputFiniteAutomaton, TransformedFiniteAutomaton } from '../../types';
import { expandCharacterRanges } from '../../utils/expandCharacterRanges';

function expandCharacterRangesForArray(
	characterRanges: (string | number)[],
	skipCharacterRangesExpansion: boolean,
	appendedString?: string
) {
	const uniqueSymbols: Set<string> = new Set();
	characterRanges.forEach((characterRange) => {
		expandCharacterRanges(characterRange.toString(), skipCharacterRangesExpansion).forEach(
			(expandedCharacterRange) => {
				uniqueSymbols.add((appendedString ?? '') + expandedCharacterRange);
			}
		);
	});

	return Array.from(uniqueSymbols);
}

/**
 * Normalizes an input automaton to a standard form
 * @param finiteAutomaton Automaton to normalize
 * @param skipCharacterRangesExpansion Skip character ranges expansion
 * @returns Normalized automaton
 */
export function normalize(
	finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
	skipCharacterRangesExpansion?: boolean
) {
	const appendedString = finiteAutomaton.append ?? '';
	// Append property is unnecessary after normalizing
	if (appendedString) {
		delete finiteAutomaton.append;
	}
	// Expanding all character ranges for the final states
	finiteAutomaton.final_states = expandCharacterRangesForArray(
		finiteAutomaton.final_states,
		skipCharacterRangesExpansion ?? false,
		appendedString
	);

	// Expanding all character ranges for the alphabet
	finiteAutomaton.alphabets = expandCharacterRangesForArray(
		finiteAutomaton.alphabets,
		skipCharacterRangesExpansion ?? false
	);

	// Expanding all character ranges for the states
	finiteAutomaton.states = expandCharacterRangesForArray(
		finiteAutomaton.states,
		skipCharacterRangesExpansion ?? false,
		appendedString
	);

	// Convert the start state to string
	finiteAutomaton.start_state = appendedString + finiteAutomaton.start_state.toString();
	// Convert all the epsilon transition values to string
	if (finiteAutomaton.epsilon_transitions) {
		Object.entries(finiteAutomaton.epsilon_transitions).forEach(
			([epsilonTransitionStartState, epsilonTransitionTargetStates]) => {
				const newEpsilonTransitionTargetStates: Set<string> = new Set();
				epsilonTransitionTargetStates.forEach((epsilonTransitionTargetState) => {
					expandCharacterRanges(
						epsilonTransitionTargetState.toString(),
						skipCharacterRangesExpansion
					).forEach((stateString) => {
						newEpsilonTransitionTargetStates.add(stateString.toString());
					});
				});
				finiteAutomaton.epsilon_transitions![epsilonTransitionStartState] = Array.from(
					newEpsilonTransitionTargetStates
				);
			}
		);
	}

	function attachToStateRecord(
		transitionStateRecord: Record<string, string[]>,
		alphabetIndex: number,
		state: string
	) {
		if (!transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]]) {
			transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]] = [state];
		} else {
			transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]].push(state);
		}
	}

	Object.entries(finiteAutomaton.transitions).forEach(([transitionKey, transitionStates]) => {
		const transitionStateRecord: Record<string, string[]> = {};
		// When its not string 'loop', we need to convert all the transition states to string
		if (typeof transitionStates !== 'string' && Array.isArray(transitionStates)) {
			transitionStates.forEach((transitionState, transitionStateIndex) => {
				// Guarding against null values
				if (transitionState !== null && transitionState !== undefined) {
					// For dealing with 1: [ ["1-3", 4], ["2"] ] => 1: [ ["1", "2", "3", "4"], ["2"] ]
					const newEpsilonTransitionTargetStates: Set<string> = new Set();
					if (Array.isArray(transitionState)) {
						// In order to remove duplicate states, we are using a set
						transitionState.forEach((state) => {
							// Expand all the state strings, which could be character ranges
							expandCharacterRanges(state.toString(), skipCharacterRangesExpansion).forEach(
								(stateString) => {
									newEpsilonTransitionTargetStates.add(stateString);
								}
							);
						});
						transitionStateRecord[finiteAutomaton.alphabets[transitionStateIndex]] = Array.from(
							newEpsilonTransitionTargetStates
						);
					}
					// For dealing with 1: [ "1-2", 3 ] => 1: [ ["1", "2"], ["3"] ]
					else {
						expandCharacterRanges(transitionState.toString(), skipCharacterRangesExpansion).forEach(
							(expandedState) => {
								attachToStateRecord(
									transitionStateRecord,
									transitionStateIndex,
									appendedString + expandedState.toString()
								);
							}
						);
					}
				}
			});
			(finiteAutomaton as TransformedFiniteAutomaton).transitions[appendedString + transitionKey] =
				transitionStateRecord;
			// If we append a string to the state, we need to delete the previous non-appended state
			if (appendedString) {
				delete finiteAutomaton.transitions[transitionKey];
			}
		} else if (transitionStates === 'loop') {
			// For loop all for encountering any symbol of the alphabet
			// We will transition to the same state
			finiteAutomaton.alphabets.forEach((_, alphabetIndex) => {
				attachToStateRecord(
					transitionStateRecord,
					alphabetIndex,
					appendedString + transitionKey.toString()
				);
			});
			(finiteAutomaton as TransformedFiniteAutomaton).transitions[appendedString + transitionKey] =
				transitionStateRecord;
			// Delete the non appended transition record state key, only if a new appended state string is used
			if (appendedString) {
				delete finiteAutomaton.transitions[transitionKey];
			}
		}
	});

	return finiteAutomaton as TransformedFiniteAutomaton;
}
