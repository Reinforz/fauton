import colors from 'colors';
import shortid from 'shortid';
import {
	GraphNode,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../types';

export class FiniteAutomaton {
	testLogic: (inputString: string, automatonTestResult: boolean) => boolean;
	automaton: TransformedFiniteAutomaton;
	#automatonId: string;
	#automatonType: TFiniteAutomatonType;

	constructor(
		testLogic: (inputString: string, automatonTestResult: boolean) => boolean,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		this.#normalize(finiteAutomaton);
	}

	#normalize(finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton) {
		this.#validate(
			finiteAutomaton.label ?? '',
			this.#generatePreNormalizationErrors(finiteAutomaton)
		);

		const appendedString = finiteAutomaton.append ?? '';
		finiteAutomaton.final_states = finiteAutomaton.final_states.map(
			(finalState) => appendedString + finalState.toString()
		);
		finiteAutomaton.alphabets = finiteAutomaton.alphabets.map((alphabet) => alphabet.toString());
		finiteAutomaton.start_state = appendedString + finiteAutomaton.start_state.toString();
		finiteAutomaton.states = finiteAutomaton.states.map(
			(state) => appendedString + state.toString()
		);
		// Convert all the epsilon transition values to string
		if (finiteAutomaton.epsilon_transitions) {
			Object.entries(finiteAutomaton.epsilon_transitions).forEach(
				([epsilonTransitionState, epsilonTransitionStates]) => {
					finiteAutomaton.epsilon_transitions![epsilonTransitionState] =
						epsilonTransitionStates.map((epsilonTransitionState) =>
							epsilonTransitionState.toString()
						);
				}
			);
		}

		function attachToStateRecord(
			transitionStateRecord: Record<string, string[]>,
			alphabetIndex: number,
			state: string
		) {
			if (!transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]]) {
				transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]] = [state];
			} else {
				transitionStateRecord[finiteAutomaton.alphabets[alphabetIndex]].push(state);
			}
		}

		Object.entries(finiteAutomaton.transitions).forEach(([transitionKey, transitionStates]) => {
			const transitionStateRecord: Record<string, string[]> = {};
			// When its not string 'loop', we need to convert all the transition states to string
			if (typeof transitionStates !== 'string' && Array.isArray(transitionStates)) {
				transitionStates.forEach((transitionState, transitionStateIndex) => {
					// Guarding against null values
					if (transitionState !== null && transitionState !== undefined) {
						// For dealing with 1: [ [2, 3] ] => 1: [ ["2", "3"] ]
						if (Array.isArray(transitionState)) {
							transitionState.forEach((state) => {
								attachToStateRecord(
									transitionStateRecord,
									transitionStateIndex,
									appendedString + state.toString()
								);
							});
						}
						// For dealing with 1: [ 2, 3 ] => 1: [ ["2"], ["3"] ]
						else {
							attachToStateRecord(
								transitionStateRecord,
								transitionStateIndex,
								appendedString + transitionState.toString()
							);
						}
					}
				});
				(finiteAutomaton as TransformedFiniteAutomaton).transitions[
					appendedString + transitionKey
				] = transitionStateRecord;
				// If we append a string to the state, we need to delete the previous non-appended state
				if (appendedString) {
					delete finiteAutomaton.transitions[transitionKey];
				}
			} else if (transitionStates === 'loop') {
				finiteAutomaton.alphabets.forEach((_, alphabetIndex) => {
					attachToStateRecord(
						transitionStateRecord,
						alphabetIndex,
						appendedString + transitionKey.toString()
					);
				});
				(finiteAutomaton as TransformedFiniteAutomaton).transitions[
					appendedString + transitionKey
				] = transitionStateRecord;
				if (appendedString) {
					delete finiteAutomaton.transitions[transitionKey];
				}
			}
		});

		this.#validate(
			finiteAutomaton.label ?? '',
			this.#generatePostNormalizationErrors(finiteAutomaton as TransformedFiniteAutomaton)
		);
		this.automaton = finiteAutomaton as TransformedFiniteAutomaton;
	}

	getAutomatonId() {
		return this.#automatonId;
	}

	#validate(automatonLabel: string, automatonValidationErrors: string[]) {
		if (automatonValidationErrors.length !== 0) {
			console.log(
				`${colors.blue.bold(automatonLabel)} ${colors.red.bold(
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

	#generatePreNormalizationErrors(automaton: InputFiniteAutomaton | TransformedFiniteAutomaton) {
		const automatonValidationErrors: string[] = [];
		const { testLogic } = this;

		if (!testLogic) {
			automatonValidationErrors.push('testLogic function is required in Automaton');
		}

		if (!automaton.label) {
			automatonValidationErrors.push('Automaton label is required');
		}

		if (!automaton.states) {
			automatonValidationErrors.push('Automaton states is required');

			// Required when checking final_states and transition states
			automaton.states = [];
		}

		if (!automaton.alphabets) {
			automatonValidationErrors.push('Automaton alphabets is required');
			// Required when checking transition states
			automaton.alphabets = [];
		}

		if (!Array.isArray(automaton.states)) {
			automatonValidationErrors.push('Automaton states must be an array');
		}

		if (automaton.states.length === 0) {
			automatonValidationErrors.push('Automaton states must be an array of length > 0');
		}

		// Checking to see if all the states are present in the transition record
		if (this.#automatonType === 'deterministic') {
			automaton.states.forEach((state) => {
				if (!automaton.transitions[state]) {
					automatonValidationErrors.push(
						`Automaton states must reference a state (${state}) that is present in transitions`
					);
				}
			});

			// Deterministic automaton can't have epsilon transitions
			if (automaton.epsilon_transitions) {
				automatonValidationErrors.push(`Deterministic automaton can't contain epsilon transitions`);
			}
		}

		if (automaton.start_state === undefined || automaton.start_state === null) {
			automatonValidationErrors.push('Automaton start_state is required');
		}

		if (automaton.final_states === undefined || automaton.final_states === null) {
			automatonValidationErrors.push('Automaton final_states is required');
			automaton.final_states = [];
		}

		if (!Array.isArray(automaton.final_states)) {
			automatonValidationErrors.push('Automaton final_states must be an array');
		}

		if (automaton.final_states.length === 0) {
			automatonValidationErrors.push('Automaton final_states must be an array of length > 0');
		}

		return automatonValidationErrors;
	}

	#generatePostNormalizationErrors(automaton: TransformedFiniteAutomaton) {
		const automatonValidationErrors: string[] = [];
		const automatonStates: Set<string> = new Set(automaton.states);
		const automatonAlphabets: Set<string> = new Set(automaton.alphabets);

		automaton.final_states.forEach((state) => {
			if (!automatonStates.has(state)) {
				automatonValidationErrors.push(
					`Automaton final_states must reference a state (${state}) that is present in states`
				);
			}
		});

		if (automaton.epsilon_transitions) {
			Object.entries(automaton.epsilon_transitions).forEach(
				([transitionState, transitionStates]) => {
					if (!automatonStates.has(transitionState)) {
						automatonValidationErrors.push(
							`Epsilon transition state ${transitionState} must reference a state that is present in states`
						);
					}
					transitionStates.forEach((transitionState) => {
						if (!automatonStates.has(transitionState)) {
							automatonValidationErrors.push(
								`Epsilon transition state ${transitionState} must reference a state that is present in states`
							);
						}
					});
				}
			);
		}

		Object.entries(automaton.transitions).forEach(([transitionKey, transitionStatesRecord]) => {
			// The transition record keys must point to a valid state
			if (!automatonStates.has(transitionKey)) {
				automatonValidationErrors.push(
					`Automaton transitions (${transitionKey}) must reference a state that is present in states`
				);
			}

			// Checking if the transition record is a POJO
			const isTransitionValuesARecord =
				transitionStatesRecord &&
				typeof transitionStatesRecord === 'object' &&
				Object.getPrototypeOf(transitionStatesRecord) === Object.prototype;

			if (this.#automatonType === 'deterministic') {
				if (typeof transitionStatesRecord !== 'string' && !isTransitionValuesARecord) {
					automatonValidationErrors.push(
						`Automaton transitions value must either be string "loop" or a tuple`
					);
				}
				// ! Completely disable loop for non-deterministic automaton
				if (typeof transitionStatesRecord === 'string' && transitionStatesRecord !== 'loop') {
					automatonValidationErrors.push(
						`Automaton transitions value when a string, can only be "loop"`
					);
				}
			}

			// all of these must refer to valid states
			/* 
      1: {
        0: ["1", "2", "3"],
        1: ["2", "3"]
      } */
			if (transitionStatesRecord && typeof transitionStatesRecord !== 'string') {
				Object.entries(transitionStatesRecord).forEach(
					([transitionStateSymbol, transitionStateResultantStates]) => {
						if (!automatonAlphabets.has(transitionStateSymbol)) {
							automatonValidationErrors.push(
								`Automaton transitions symbol (${transitionStateSymbol}), must reference a valid alphabet`
							);
						}
						transitionStateResultantStates.forEach((transitionStateResultantState) => {
							if (!automatonStates.has(transitionStateResultantState)) {
								automatonValidationErrors.push(
									`Automaton transitions value (${transitionStateResultantState}) when a tuple, must reference a valid state`
								);
							}
						});
					}
				);
			}
		});

		return automatonValidationErrors;
	}

	generateGraphFromString(inputString: string) {
		let currentParents: GraphNode[] = [
			{
				name: `${this.automaton.start_state}`,
				state: this.automaton.start_state,
				string: '',
				depth: 0,
				symbol: null,
				children: [],
			},
		];
		const finalNodes: GraphNode[] = [];
		let automatonTestResult = false;
		const finalStates = new Set(this.automaton.final_states);

		const graph = currentParents;
		for (let index = 0; index < inputString.length; index++) {
			const newChildren: GraphNode[] = [];
			const symbol = inputString[index];
			currentParents.forEach((currentParent) => {
				const transitionState = this.automaton.transitions[currentParent.state];
				if (transitionState) {
					const transitionStates = transitionState[symbol];
					if (Array.isArray(transitionStates)) {
						transitionStates.forEach((transitionState) => {
							const parentGraphNode = {
								name: transitionState + `(${symbol})`,
								state: transitionState,
								string: inputString.slice(0, index + 1),
								depth: index + 1,
								symbol,
								children: [],
							};
							currentParent.children.push(parentGraphNode);
							newChildren.push(parentGraphNode);
						});
					}
				}
			});
			// Last symbol
			if (index === inputString.length - 1) {
				for (let index = 0; index < newChildren.length; index++) {
					const newChild = newChildren[index];
					if (finalStates.has(newChild.state)) {
						automatonTestResult = true;
						break;
					}
				}
				finalNodes.push(...newChildren);
			}
			currentParents = newChildren;
		}
		return {
			automatonTestResult,
			finalNodes,
			graph: graph[0],
		};
	}
}
