import { TransformedFiniteAutomaton } from '../../../types';

export function epsilonClosureOfState(
	epsilonTransitions: TransformedFiniteAutomaton['epsilon_transitions'],
	state: string
) {
	const stack: string[] = [];
	const allEpsilonStates: Set<string> = new Set([state]);
	stack.push(state);
	while (stack.length !== 0) {
		const currentState = stack.pop()!;
		epsilonTransitions![currentState]?.forEach((epsilonTransitionState) => {
			if (!allEpsilonStates.has(epsilonTransitionState)) {
				stack.push(epsilonTransitionState);
				allEpsilonStates.add(epsilonTransitionState);
			}
		});
	}

	return Array.from(allEpsilonStates);
}
