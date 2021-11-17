/* eslint-disable no-param-reassign */
import {
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../../../types';
import { generatePostNormalizationErrors } from './generatePostNormalizationErrors';
import { generatePreNormalizationErrors } from './generatePreNormalizationErrors';
import { validate } from './validate';

export function normalize(
	testLogic: IAutomatonTestLogicFn,
	automatonType: TFiniteAutomatonType,
	finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton
) {
	validate(
		finiteAutomaton.label,
		generatePreNormalizationErrors(testLogic, automatonType, finiteAutomaton)
	);

	const appendedString = finiteAutomaton.append ?? '';
	if (appendedString) {
		delete finiteAutomaton.append;
	}
	finiteAutomaton.final_states = finiteAutomaton.final_states.map(
		(finalState) => appendedString + finalState.toString()
	);
	finiteAutomaton.alphabets = finiteAutomaton.alphabets.map((alphabet) => alphabet.toString());
	finiteAutomaton.start_state = appendedString + finiteAutomaton.start_state.toString();
	finiteAutomaton.states = finiteAutomaton.states.map((state) => appendedString + state.toString());
	// Convert all the epsilon transition values to string
	if (finiteAutomaton.epsilon_transitions) {
		Object.entries(finiteAutomaton.epsilon_transitions).forEach(
			([epsilonTransitionStartState, epsilonTransitionTargetStates]) => {
				finiteAutomaton.epsilon_transitions![epsilonTransitionStartState] =
					epsilonTransitionTargetStates.map((epsilonTransitionTargetState) =>
						epsilonTransitionTargetState.toString()
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
					// For dealing with 1: [ [2, 3] ] => 1: [ ["2", "3"] ]
					if (Array.isArray(transitionState)) {
						transitionState.forEach((state) => {
							attachToStateRecord(
								transitionStateRecord,
								transitionStateIndex,
								appendedString + state.toString()
							);
						});
					}
					// For dealing with 1: [ 2, 3 ] => 1: [ ["2"], ["3"] ]
					else {
						attachToStateRecord(
							transitionStateRecord,
							transitionStateIndex,
							appendedString + transitionState.toString()
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
			finiteAutomaton.alphabets.forEach((_, alphabetIndex) => {
				attachToStateRecord(
					transitionStateRecord,
					alphabetIndex,
					appendedString + transitionKey.toString()
				);
			});
			(finiteAutomaton as TransformedFiniteAutomaton).transitions[appendedString + transitionKey] =
				transitionStateRecord;
			if (appendedString) {
				delete finiteAutomaton.transitions[transitionKey];
			}
		}
	});

	validate(
		finiteAutomaton.label,
		generatePostNormalizationErrors(finiteAutomaton as TransformedFiniteAutomaton)
	);
	return finiteAutomaton as TransformedFiniteAutomaton;
}
