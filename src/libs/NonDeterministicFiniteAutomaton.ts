import { IAutomatonTestLogicFn, IFiniteAutomaton, InputFiniteAutomaton } from '../types';
import { DeterministicFiniteAutomaton } from './DeterministicFiniteAutomaton';
import { FiniteAutomaton } from './FiniteAutomaton';

export class NonDeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
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
			this.automaton.states.forEach((state) => {
				// Only if the state has a key on the epsilon transition record, we are gonna expand it
				if (epsilonTransitions![state]) {
					const firstPhaseSet = this.epsilonClosureOfState(state);
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
					if (this.automaton.transitions[state]) {
						this.automaton.transitions[state][alphabet] = Array.from(thirdPhaseSet);
					} else {
						this.automaton.transitions[state] = {
							[alphabet]: Array.from(thirdPhaseSet),
						};
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
		const finalStates = new Set(transitionRecordExtractedStates);
		// No need to calculate epsilon closures of regular nfa
		if (this.automaton.epsilon_transitions) {
			transitionRecordExtractedStates.forEach((transitionRecordExtractedState) => {
				const epsilonClosureOfStates = this.epsilonClosureOfState(transitionRecordExtractedState);
				epsilonClosureOfStates.forEach((epsilonClosureOfState) => {
					finalStates.add(epsilonClosureOfState);
				});
			});
		}
		return Array.from(finalStates);
	}

	convertToDeterministicFiniteAutomaton(
		dfaOptions?: Partial<
			Pick<Pick<IFiniteAutomaton, 'automaton'>['automaton'], 'label' | 'description'> & {
				separator: string;
			}
		>
	) {
		const separator = dfaOptions?.separator ?? ',';
		const startState = this.automaton.start_state;
		const newStartStates = this.automaton.epsilon_transitions
			? this.epsilonClosureOfState(startState)
			: [this.automaton.start_state];
		const newStartStateString = newStartStates.sort().join(separator);
		const newStates: Set<string> = new Set();
		const unmarkedStates: string[] = [newStartStateString];
		const newTransitionsRecord: FiniteAutomaton['automaton']['transitions'] = {};
		const totalAlphabets = this.automaton.alphabets.length;
		const newFinalStates: Set<string> = new Set();
		newStates.add(newStartStateString);
		let hasDeadState = false;
		while (unmarkedStates.length !== 0) {
			const currentStatesString = unmarkedStates.shift()!;
			this.automaton.alphabets.forEach((symbol, symbolIndex) => {
				const newStateString = this.moveAndEpsilonClosureStateSet(
					currentStatesString!.split(separator),
					symbol
				)
					.sort()
					.join(separator);
				if (!newStates.has(newStateString) && newStateString) {
					newStates.add(newStateString);
					unmarkedStates.push(newStateString);
				}
				if (!newStateString) {
					hasDeadState = true;
					newStates.add(`Ø`);
				}
				if (!newTransitionsRecord[currentStatesString]) {
					newTransitionsRecord[currentStatesString] = new Array(totalAlphabets).fill(null) as any;
				}
				if (newStateString)
					newTransitionsRecord[currentStatesString][symbolIndex] = [newStateString];
				else {
					newTransitionsRecord[currentStatesString][symbolIndex] = [`Ø`];
				}
			});
		}

		// Checking if the new state string should be a final state
		this.automaton.final_states.forEach((finalState) => {
			newStates.forEach((newState) => {
				if (newState.includes(finalState)) {
					newFinalStates.add(newState);
				}
			});
		});

		if (hasDeadState) {
			newTransitionsRecord['Ø'] = {};
			this.automaton.alphabets.forEach((symbol) => {
				newTransitionsRecord['Ø'][symbol] = ['Ø'];
			});
		}

		return new DeterministicFiniteAutomaton(this.testLogic, {
			alphabets: this.automaton.alphabets,
			final_states: Array.from(newFinalStates),
			label: dfaOptions?.label ?? this.automaton.label,
			start_state: newStartStateString,
			states: Array.from(newStates),
			transitions: newTransitionsRecord,
			epsilon_transitions: null,
			description: dfaOptions?.description ?? this.automaton.description,
		});
	}
}
