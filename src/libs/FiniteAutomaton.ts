import colors from 'colors';
import shortid from 'shortid';
import {
	GraphNode,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../types';

export class FiniteAutomaton {
	testLogic: (inputString: string) => boolean;
	automaton: TransformedFiniteAutomaton;
	#automatonId: string;
	#automatonType: TFiniteAutomatonType;

	constructor(
		testLogic: (inputString: string) => boolean,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		this.automaton = this.#normalize(finiteAutomaton);
		this.#validate();
	}

	#normalize(finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton) {
		const appendedString = finiteAutomaton.append ?? '';
		finiteAutomaton.final_states = finiteAutomaton.final_states.map(
			(finalState) => appendedString + finalState.toString()
		);
		finiteAutomaton.alphabets = finiteAutomaton.alphabets.map((alphabet) => alphabet.toString());
		finiteAutomaton.start_state = appendedString + finiteAutomaton.start_state.toString();
		finiteAutomaton.states = finiteAutomaton.states.map(
			(state) => appendedString + state.toString()
		);

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
					if (transitionState) {
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
			} else {
				finiteAutomaton.alphabets.forEach((_, alphabetIndex) => {
					attachToStateRecord(
						transitionStateRecord,
						alphabetIndex,
						appendedString + transitionKey.toString()
					);
				});
			}
			(finiteAutomaton as TransformedFiniteAutomaton).transitions[appendedString + transitionKey] =
				transitionStateRecord;
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
		const automatonAlphabets: Set<string> = new Set(automaton.alphabets);

		if (!testLogic) {
			errors.push('testLogic function is required in Automaton');
		}

		if (!automaton.label) {
			errors.push('Automaton label is required');
		}

		if (!automaton.states) {
			errors.push('Automaton states is required');

			// Required when checking final_states and transition states
			automaton.states = [];
		}

		if (!automaton.alphabets) {
			errors.push('Automaton alphabets is required');
			// Required when checking transition states
			automaton.alphabets = [];
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

		Object.entries(automaton.transitions).forEach(([transitionKey, transitionStatesRecord]) => {
			// The transition record keys must point to a valid state
			if (!automatonStates.has(transitionKey)) {
				errors.push(
					`Automaton transitions must reference a state (${transitionKey}) that is present in states`
				);
			}

			// Checking if the transition record is a POJO
			const isTransitionValuesARecord =
				typeof transitionStatesRecord === 'object' &&
				Object.getPrototypeOf(transitionStatesRecord) === Object.prototype;

			if (this.#automatonType === 'deterministic') {
				if (typeof transitionStatesRecord !== 'string' && !isTransitionValuesARecord) {
					errors.push(`Automaton transitions value must either be string "loop" or a tuple`);
				}
				// ! Completely disable loop for non-deterministic automaton
				if (typeof transitionStatesRecord === 'string' && transitionStatesRecord !== 'loop') {
					errors.push(`Automaton transitions value when a string, can only be "loop"`);
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
							errors.push(
								`Automaton transitions symbol (${transitionStateSymbol}), must reference a valid alphabet`
							);
						}
						transitionStateResultantStates.forEach((transitionStateResultantState) => {
							if (!automatonStates.has(transitionStateResultantState)) {
								errors.push(
									`Automaton transitions value (${transitionStateResultantState}) when a tuple, must reference a valid state`
								);
							}
						});
					}
				);
			}
		});

		return errors;
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
				const transitionStates = (
					this.automaton.transitions[currentParent.state] as Record<string, string[]>
				)[symbol];
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
