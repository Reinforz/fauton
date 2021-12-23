import { TransformedFiniteAutomaton } from '../../types';
import { epsilonClosureOfState } from './epsilonClosureOfState';
import { moveAndEpsilonClosureStateSet } from './moveAndEpsilonClosureStateSet';

/**
 * Convert an epsilon-nfa to nfa
 * @param automaton epsilon-nfa to be converted
 */
export function convertToRegularNfa(
	automaton: Pick<
		TransformedFiniteAutomaton,
		'transitions' | 'epsilon_transitions' | 'alphabets' | 'states'
	>
) {
	const { transitions, states, alphabets, epsilon_transitions: epsilonTransitions } = automaton;
	const epsilonClosureOfStateCache: Record<string, string[]> = {};
	alphabets.forEach((symbol) => {
		states.forEach((state) => {
			// Only if the state has a key on the epsilon transition record, we are gonna expand it
			if (epsilonTransitions && epsilonTransitions[state]) {
				const epsilonClosuredStates = !epsilonClosureOfStateCache[state]
					? epsilonClosureOfState(automaton.epsilon_transitions, state)
					: epsilonClosureOfStateCache[state];
				if (!epsilonClosureOfStateCache[state]) {
					epsilonClosureOfStateCache[state] = epsilonClosuredStates;
				}

				const epsilonClosuredStatesForSymbol = moveAndEpsilonClosureStateSet(
					transitions,
					epsilonTransitions,
					Array.from(epsilonClosuredStates),
					symbol
				);
				if (transitions[state]) {
					transitions[state][symbol] = epsilonClosuredStatesForSymbol;
				} else {
					transitions[state] = {
						[symbol]: epsilonClosuredStatesForSymbol,
					};
				}
			}
		});
	});
}
