import { InputFiniteAutomaton } from '../types';
import { FiniteAutomaton } from './FiniteAutomaton';

export class NonDeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: (inputString: string) => boolean,
		automaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'non-deterministic', automatonId);
		if (this.automaton.epsilon_transitions) {
			this.convertToRegularNfa();
		}
	}

	convertToRegularNfa() {
		const { alphabets, epsilon_transitions: epsilonTransitions, transitions } = this.automaton;
		alphabets.forEach((alphabet) => {
			Object.entries(transitions).forEach(([transitionState, transitionsRecord]) => {
				// Only if the state has a key on the epsilon transition record, we are gonna expand it
				if (epsilonTransitions![transitionState]) {
					const firstPhaseSet = this.epsilonClosureOfState(transitionState);
					const secondPhaseSet = new Set<string>();
					firstPhaseSet.forEach((state) => {
						// Some states might be null, and thus have no transitions
						if (transitions[state]) {
							transitions[state][alphabet]?.forEach((transitionRecordState) => {
								secondPhaseSet.add(transitionRecordState);
							});
						}
					});

					const thirdPhaseSet: Set<string> = new Set();
					secondPhaseSet.forEach((secondPhaseState) => {
						this.epsilonClosureOfState(secondPhaseState).forEach((state) => {
							thirdPhaseSet.add(state);
						});
					});
					if (transitionsRecord) {
						transitionsRecord[alphabet] = Array.from(thirdPhaseSet);
					}
				}
			});
		});
	}

	/**
	 * Generates a set of states reachable from input state, using depth-first-search algorithm
	 * @param state Start state
	 * @returns A set of states reachable from the input state on all epsilon transitions
	 */
	epsilonClosureOfState(state: string) {
		const { epsilon_transitions: epsilonTransitions } = this.automaton;
		const stack: string[] = [];
		const allEpsilonStates: Set<string> = new Set(state);
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

		return allEpsilonStates;
	}

	convertToDeterministicFiniteAutomaton() {
		return null;
	}
}
