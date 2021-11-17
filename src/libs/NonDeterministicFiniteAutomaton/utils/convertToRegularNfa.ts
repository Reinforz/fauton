import { TransformedFiniteAutomaton } from '../../../types';
import { epsilonClosureOfState } from './epsilonClosureOfState';

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
	alphabets.forEach((alphabet) => {
		states.forEach((state) => {
			// Only if the state has a key on the epsilon transition record, we are gonna expand it
			if (epsilonTransitions && epsilonTransitions[state]) {
				const firstPhaseStates = !epsilonClosureOfStateCache[state]
					? epsilonClosureOfState(automaton.epsilon_transitions, state)
					: epsilonClosureOfStateCache[state];
				if (!epsilonClosureOfStateCache[state]) {
					epsilonClosureOfStateCache[state] = firstPhaseStates;
				}
				const secondPhaseStates = new Set<string>();
				const thirdPhaseSet: Set<string> = new Set();

				firstPhaseStates.forEach((firstPhaseState) => {
					// Some states might be null, and thus have no transitions
					if (transitions[firstPhaseState]) {
						transitions[firstPhaseState][alphabet]?.forEach((transitionRecordState) => {
							secondPhaseStates.add(transitionRecordState);
						});
					}
				});

				secondPhaseStates.forEach((secondPhaseState) => {
					const epsilonClosuredStates = !epsilonClosureOfStateCache[secondPhaseState]
						? epsilonClosureOfState(automaton.epsilon_transitions, secondPhaseState)
						: epsilonClosureOfStateCache[secondPhaseState];
					if (!epsilonClosureOfStateCache[secondPhaseState]) {
						epsilonClosureOfStateCache[secondPhaseState] = epsilonClosuredStates;
					}
					epsilonClosuredStates.forEach((closuredState) => {
						thirdPhaseSet.add(closuredState);
					});
				});
				if (transitions[state]) {
					transitions[state][alphabet] = Array.from(thirdPhaseSet);
				} else {
					transitions[state] = {
						[alphabet]: Array.from(thirdPhaseSet),
					};
				}
			}
		});
	});
}
