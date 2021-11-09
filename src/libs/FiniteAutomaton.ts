import colors from 'colors';
import shortid from 'shortid';
import { InputFiniteAutomaton, TFiniteAutomatonType, TransformedFiniteAutomaton } from '../types';

interface GraphNode {
	state: string;
	symbol: null | string;
	children: GraphNode[];
	index: number;
	string: string;
}

export class FiniteAutomaton {
	testLogic: (inputString: string) => boolean;
	automaton: TransformedFiniteAutomaton;
	#automatonId: string;
	#automatonType: TFiniteAutomatonType;

	constructor(
		testLogic: (inputString: string) => boolean,
		finiteAutomaton: InputFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		this.automaton = this.#normalize(finiteAutomaton);
		this.#validate();
	}

	#normalize(finiteAutomaton: InputFiniteAutomaton) {
		const appendedString = finiteAutomaton.append ?? '';
		finiteAutomaton.final_states = finiteAutomaton.final_states.map(
			(finalState) => appendedString + finalState.toString()
		);
		finiteAutomaton.start_state = appendedString + finiteAutomaton.start_state.toString();
		finiteAutomaton.states = finiteAutomaton.states.map(
			(state) => appendedString + state.toString()
		);
		Object.entries(finiteAutomaton.transitions).forEach(([transitionKey, transitionStates]) => {
			// When its not string 'loop', we need to convert all the transition states to string
			if (typeof transitionStates !== 'string') {
				transitionStates.forEach((transitionState, transitionStateIndex) => {
					// For dealing with 1: [ [2, 3] ] => 1: [ ["2", "3"] ]
					if (Array.isArray(transitionState)) {
						transitionState.forEach((state, stateIndex) => {
							transitionState[stateIndex] = appendedString + state.toString();
						});
					}
					// For dealing with 1: [ 2, 3 ] => 1: [ ["2"], ["3"] ]
					else {
						transitionStates[transitionStateIndex] = [appendedString + transitionState.toString()];
					}
				});
			}
			finiteAutomaton.transitions[appendedString + transitionKey] =
				finiteAutomaton.transitions[transitionKey];
			if (appendedString) {
				delete finiteAutomaton.transitions[transitionKey];
			}
		});

		return finiteAutomaton as TransformedFiniteAutomaton;
	}

	getAutomatonId() {
		return this.#automatonId;
	}

	#validate() {
		const automatonValidationErrors = this.#generateErrors();
		if (automatonValidationErrors.length !== 0) {
			console.log(
				`${colors.blue.bold(this.automaton.label)} ${colors.red.bold(
					automatonValidationErrors.length.toString()
				)} Errors`
			);
			automatonValidationErrors.forEach((automatonValidationError) =>
				console.log(colors.red.bold(automatonValidationError))
			);
			console.log();
			throw new Error(`Error validating automaton`);
		}
	}

	#generateErrors() {
		const errors: string[] = [];
		const { testLogic, automaton } = this;

		const automatonStates: Set<string> = new Set(automaton.states);

		if (!testLogic) {
			errors.push('testLogic function is required in Automaton');
		}

		if (!automaton.label) {
			errors.push('Automaton label is required');
		}

		if (!automaton.states) {
			errors.push('Automaton states is required');

			// Required when checking final_states and transition tuple states
			automaton.states = [];
		}

		if (!Array.isArray(automaton.states)) {
			errors.push('Automaton states must be an array');
		}

		if (automaton.states.length === 0) {
			errors.push('Automaton states must be an array of length > 0');
		}

		// Checking to see if all the states are present in the transition record
		if (this.#automatonType === 'deterministic') {
			automaton.states.forEach((state) => {
				if (!automaton.transitions[state]) {
					errors.push(
						`Automaton states must reference a state (${state}) that is present in transitions`
					);
				}
			});
		}

		if (automaton.start_state === undefined || automaton.start_state === null) {
			errors.push('Automaton start_state is required');
		}

		if (automaton.final_states === undefined || automaton.final_states === null) {
			errors.push('Automaton final_states is required');
			automaton.final_states = [];
		}

		if (!Array.isArray(automaton.final_states)) {
			errors.push('Automaton final_states must be an array');
		}

		if (automaton.final_states.length === 0) {
			errors.push('Automaton final_states must be an array of length > 0');
		}

		automaton.final_states.forEach((state) => {
			if (!automatonStates.has(state)) {
				errors.push(
					`Automaton final_states must reference a state (${state}) that is present in states`
				);
			}
		});

		Object.entries(automaton.transitions).forEach(([transitionKey, transitionStates]) => {
			// The transition record keys must point to a valid state
			if (!automatonStates.has(transitionKey)) {
				errors.push(
					`Automaton transitions must reference a state (${transitionKey}) that is present in states`
				);
			}

			const isTransitionValuesAnArray = Array.isArray(transitionStates);

			if (this.#automatonType === 'deterministic') {
				if (typeof transitionStates !== 'string' && !isTransitionValuesAnArray) {
					errors.push(`Automaton transitions value must either be string "loop" or a tuple`);
				}
				// ! the length should be equal to the alphabets of the FA
				// ! rather than constant 2, as it is only applicable for binary languages
				if (isTransitionValuesAnArray && transitionStates.length !== 2) {
					errors.push(`Automaton transitions value when a tuple, can contain only 2 items`);
				}

				// ! Completely disable loop for non-deterministic automaton
				if (typeof transitionStates === 'string' && transitionStates !== 'loop') {
					errors.push(`Automaton transitions value when a string, can only be "loop"`);
				}
			}

			if (isTransitionValuesAnArray) {
				transitionStates.forEach((transitionState) => {
					transitionState.forEach((state) => {
						if (!automatonStates.has(state)) {
							errors.push(
								`Automaton transitions value (${state}) when a tuple, must reference a valid state`
							);
						}
					});
				});
			}
		});

		return errors;
	}

	generateGraphFromString(inputString: string) {
		let currentParents: GraphNode[] = [
			{
				state: this.automaton.start_state,
				string: '',
				index: 0,
				symbol: null,
				children: [],
			},
		];
		const finalNodes: GraphNode[] = [];

		const graph = currentParents;
		for (let index = 0; index < inputString.length; index++) {
			const newChildren: GraphNode[] = [];
			const symbol = inputString[index];
			currentParents.forEach((currentParent) => {
				const transitionStates = this.automaton.transitions[currentParent.state][parseInt(symbol)];
				if (Array.isArray(transitionStates)) {
					transitionStates.forEach((transitionState) => {
						const parentGraphNode = {
							state: transitionState,
							string: inputString.slice(0, index + 1),
							index: index + 1,
							symbol,
							children: [],
						};
						currentParent.children.push(parentGraphNode);
						newChildren.push(parentGraphNode);
					});
				}
			});
			// For the last symbol
			if (index === inputString.length - 1) {
				finalNodes.push(...newChildren);
			}
			currentParents = newChildren;
		}
		return {
			finalNodes,
			graph: graph[0],
		};
	}
}
