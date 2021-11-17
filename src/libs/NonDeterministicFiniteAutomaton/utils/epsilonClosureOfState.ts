import { TransformedFiniteAutomaton } from '../../../types';

/**
 * Returns an array of states that can be reached from a given state for epsilon symbol
 * @param epsilonTransitions Epsilon transitions record of automaton
 * @param state Source state
 * @returns Array of states
 */
export function epsilonClosureOfState(
	epsilonTransitions: TransformedFiniteAutomaton['epsilon_transitions'],
	state: string
) {
	const statesStack: string[] = [];
	const allEpsilonStates: Set<string> = new Set([state]);
	statesStack.push(state);
	while (statesStack.length !== 0) {
		const currentState = statesStack.pop()!;
		epsilonTransitions![currentState]?.forEach((epsilonTransitionState) => {
			if (!allEpsilonStates.has(epsilonTransitionState)) {
				statesStack.push(epsilonTransitionState);
				allEpsilonStates.add(epsilonTransitionState);
			}
		});
	}

	return Array.from(allEpsilonStates);
}
