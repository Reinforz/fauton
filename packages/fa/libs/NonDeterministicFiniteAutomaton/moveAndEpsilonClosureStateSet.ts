import { TransformedFiniteAutomaton } from '../types';
import { epsilonClosureOfState } from './epsilonClosureOfState';

/**
 * Move_DFA(states_arr, symbol)
 * @param transitions Transition record of automaton
 * @param epsilonTransitions epsilon transitions record of automaton
 * @param states array of states
 * @param symbol Symbol for which to find e-closure of
 * @returns array of states obtained by epsilon closure for a symbol
 */
export function moveAndEpsilonClosureStateSet(
	transitions: TransformedFiniteAutomaton['transitions'],
	epsilonTransitions: TransformedFiniteAutomaton['epsilon_transitions'],
	states: string[],
	symbol: string
) {
	const transitionRecordExtractedStates: Set<string> = new Set();
	states.forEach((state) => {
		const statesForSymbol = transitions[state]?.[symbol];
		if (statesForSymbol) {
			statesForSymbol.forEach((stateForSymbol) =>
				transitionRecordExtractedStates.add(stateForSymbol)
			);
		}
	});
	const finalStates = new Set(transitionRecordExtractedStates);
	// No need to calculate epsilon closures of regular nfa
	if (epsilonTransitions) {
		transitionRecordExtractedStates.forEach((transitionRecordExtractedState) => {
			const epsilonClosuredStates = epsilonClosureOfState(
				epsilonTransitions,
				transitionRecordExtractedState
			);
			epsilonClosuredStates.forEach((epsilonClosuredState) => {
				finalStates.add(epsilonClosuredState);
			});
		});
	}
	return Array.from(finalStates);
}
