import { TransformedFiniteAutomaton } from '../../../types';
import { epsilonClosureOfState } from './epsilonClosureOfState';

export function convertToRegularNfa(
	automaton: Pick<
		TransformedFiniteAutomaton,
		'transitions' | 'epsilon_transitions' | 'alphabets' | 'states'
	>
) {
	const { transitions, states, alphabets, epsilon_transitions: epsilonTransitions } = automaton;
	alphabets.forEach((alphabet) => {
		states.forEach((state) => {
			// Only if the state has a key on the epsilon transition record, we are gonna expand it
			if (epsilonTransitions![state]) {
				const firstPhaseStates = epsilonClosureOfState(automaton.epsilon_transitions, state);
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
					epsilonClosureOfState(automaton.epsilon_transitions, secondPhaseState).forEach(
						(closuredState) => {
							thirdPhaseSet.add(closuredState);
						}
					);
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
