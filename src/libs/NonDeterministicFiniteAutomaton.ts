import { InputFiniteAutomaton } from '../types';
import { DeterministicFiniteAutomaton } from './DeterministicFiniteAutomaton';
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
					const thirdPhaseSet: Set<string> = new Set();

					firstPhaseSet.forEach((state) => {
						// Some states might be null, and thus have no transitions
						if (transitions[state]) {
							transitions[state][alphabet]?.forEach((transitionRecordState) => {
								secondPhaseSet.add(transitionRecordState);
							});
						}
					});

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
	 * @param state state from where to start searching for epsilon closure states
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

		return Array.from(allEpsilonStates);
	}

	// ε-closure(Move_NFA(states, letter))
	moveAndEpsilonClosureStateSet(states: string[], symbol: string) {
		const transitionRecordExtractedStates: Set<string> = new Set();
		states.forEach((state) => {
			const statesForSymbol = this.automaton.transitions[state]?.[symbol];
			if (statesForSymbol) {
				statesForSymbol.forEach((stateForSymbol) =>
					transitionRecordExtractedStates.add(stateForSymbol)
				);
			}
		});
		const finalStates: Set<string> = new Set(states);
		// No need to calculate epsilon closures of regular nfa
		if (!this.automaton.epsilon_transitions) {
			transitionRecordExtractedStates.forEach((transitionRecordExtractedState) => {
				const epsilonClosureOfStates = this.epsilonClosureOfState(transitionRecordExtractedState);
				epsilonClosureOfStates.forEach((epsilonClosureOfState) => {
					finalStates.add(epsilonClosureOfState);
				});
			});
		}
		return Array.from(finalStates);
	}

	convertToDeterministicFiniteAutomaton() {
		const startState = this.automaton.start_state;
		const newStartStates = this.epsilonClosureOfState(startState);
		const newStateStateString = newStartStates.sort().join(',');
		const newStates: Set<string> = new Set();
		const unmarkedStates: string[] = [newStateStateString];
		const newTransitionsRecord: FiniteAutomaton['automaton']['transitions'] = {};
		const totalAlphabets = this.automaton.alphabets.length;
		const newFinalStates: Set<string> = new Set();

		newStates.add(newStateStateString);

		while (unmarkedStates.length !== 0) {
			const currentStatesString = unmarkedStates.shift()!;
			this.automaton.alphabets.forEach((symbol, symbolIndex) => {
				const newStateString = this.moveAndEpsilonClosureStateSet(
					currentStatesString!.split(','),
					symbol
				)
					.sort()
					.join(',');
				if (!newStates.has(newStateString)) {
					newStates.add(newStateString);
					unmarkedStates.push(newStateString);
				}
				if (!newTransitionsRecord[currentStatesString]) {
					newTransitionsRecord[currentStatesString] = new Array(totalAlphabets).fill(null) as any;
				}
				newTransitionsRecord[currentStatesString][symbolIndex] = [newStateString];
				// Checking if the new state string should be a final state
				this.automaton.final_states.forEach((finalState) => {
					if (newStateString.includes(finalState)) {
						newFinalStates.add(newStateString);
					}
				});
			});
		}

		return new DeterministicFiniteAutomaton(this.testLogic, {
			alphabets: this.automaton.alphabets,
			final_states: Array.from(newFinalStates),
			label: this.automaton.label,
			start_state: newStateStateString,
			states: Array.from(newStates),
			transitions: newTransitionsRecord,
			epsilon_transitions: null,
		});
	}
}
