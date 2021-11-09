import colors from 'colors';
import { FiniteAutomatonModule, InputFiniteAutomaton } from '../types';
import FiniteAutomaton from './FiniteAutomaton';

type IMergedDfaOptions = Partial<
	Pick<Pick<FiniteAutomatonModule, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;

type TMergeOperation = 'or' | 'and' | 'not';
export class DfaModule extends FiniteAutomaton {
	constructor(
		testLogic: (binaryString: string) => boolean,
		automaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, automatonId);
		this.#validate();
	}

	#validate() {
		const dfaModuleValidationErrors = this.generateErrors();
		if (dfaModuleValidationErrors.length !== 0) {
			console.log(
				`${colors.blue.bold(this.automaton.label)} ${colors.red.bold(
					dfaModuleValidationErrors.length.toString()
				)} Errors`
			);
			dfaModuleValidationErrors.forEach((dfaModuleValidationError) =>
				console.log(colors.red.bold(dfaModuleValidationError))
			);
			console.log();
			throw new Error(`Error validating dfa modules`);
		}
	}

	generateErrors() {
		const errors: string[] = [];
		const { testLogic, automaton } = this;
		if (!testLogic) {
			errors.push('testLogic function is required in dfa module');
		}

		if (!automaton.label) {
			errors.push('Dfa label is required');
		}

		if (!automaton.states) {
			errors.push('Dfa states is required');

			// Required when checking final_states and transition tuple states
			automaton.states = [];
		}

		if (!Array.isArray(automaton.states)) {
			errors.push('Dfa states must be an array');
		}

		if (automaton.states.length === 0) {
			errors.push('Dfa states must be an array of length > 0');
		}

		automaton.states.forEach((state) => {
			if (!automaton.transitions[state]) {
				errors.push(`Dfa states must reference a state (${state}) that is present in transitions`);
			}
		});

		if (automaton.start_state === undefined || automaton.start_state === null) {
			errors.push('Dfa start_state is required');
		}

		if (automaton.final_states === undefined || automaton.final_states === null) {
			errors.push('Dfa final_states is required');
			automaton.final_states = [];
		}

		if (!Array.isArray(automaton.final_states)) {
			errors.push('Dfa final_states must be an array');
		}

		if (automaton.final_states.length === 0) {
			errors.push('Dfa final_states must be an array of length > 0');
		}

		automaton.final_states.forEach((state) => {
			if (!automaton.states.includes(state)) {
				errors.push(`Dfa final_states must reference a state (${state}) that is present in states`);
			}
		});

		Object.entries(automaton.transitions).forEach(([transitionKey, transitionValues]) => {
			if (!automaton.states.includes(transitionKey)) {
				errors.push(
					`Dfa transitions must reference a state (${transitionKey}) that is present in states`
				);
			}

			if (typeof transitionValues !== 'string' && !Array.isArray(transitionValues)) {
				errors.push(`Dfa transitions value must either be string "loop" or a tuple`);
			}

			if (Array.isArray(transitionValues) && transitionValues.length !== 2) {
				errors.push(`Dfa transitions value when a tuple, can contain only 2 items`);
			}

			if (typeof transitionValues === 'string' && transitionValues !== 'loop') {
				errors.push(`Dfa transitions value when a string, can only be "loop"`);
			}

			if (Array.isArray(transitionValues)) {
				transitionValues.forEach((transitionValue) => {
					if (!automaton.states.includes(transitionValue)) {
						errors.push(
							`Dfa transitions value (${transitionValue}) when a tuple, must reference a valid state`
						);
					}
				});
			}
		});

		return errors;
	}

	#generateMergedDfaData(
		dfaState: string,
		newStates: string[],
		newTransitions: FiniteAutomatonModule['automaton']['transitions'],
		newFinalStates: Set<string>,
		mergeOperation: TMergeOperation,
		dfaModule: DfaModule | undefined,
		isComposite: boolean,
		separator: string
	) {
		this.automaton.states.forEach((currentDfaState) => {
			const newState = isComposite
				? `${dfaModule ? dfaState + separator : dfaState}${currentDfaState}`
				: currentDfaState;
			if (isComposite) {
				newStates.push(newState);
				const newStateForSymbolZero =
					(dfaModule ? dfaModule.automaton.transitions[dfaState][0].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][0].toString();
				const newStateForSymbolOne =
					(dfaModule ? dfaModule.automaton.transitions[dfaState][1].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][1].toString();
				newTransitions[newState] = [newStateForSymbolZero, newStateForSymbolOne];
				if (
					mergeOperation === 'or' &&
					((dfaModule ? dfaModule.automaton.final_states.includes(dfaState) : true) ||
						this.automaton.final_states.includes(currentDfaState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(dfaModule ? dfaModule.automaton.final_states.includes(dfaState) : true) &&
					this.automaton.final_states.includes(currentDfaState)
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'not' &&
					!this.automaton.final_states.includes(currentDfaState)
				) {
					newFinalStates.add(newState);
				}
			} else {
				if (
					mergeOperation === 'or' &&
					((dfaModule ? dfaModule.automaton.final_states.includes(newState) : true) ||
						this.automaton.final_states.includes(newState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(dfaModule ? dfaModule.automaton.final_states.includes(newState) : true) &&
					this.automaton.final_states.includes(newState)
				) {
					newFinalStates.add(newState);
				} else if (mergeOperation === 'not' && !this.automaton.final_states.includes(newState)) {
					newFinalStates.add(newState);
				}
			}
		});
	}

	#merge(
		dfaModule: DfaModule | undefined,
		mergeOperation: TMergeOperation,
		mergedDfaOptions?: IMergedDfaOptions
	) {
		const { separator = '.', label, description } = mergedDfaOptions ?? ({} as IMergedDfaOptions);
		const newStates: string[] = [];
		const newTransitions: FiniteAutomatonModule['automaton']['transitions'] = {};
		// If we have two different dfa's we are in composite mode
		const isComposite = (dfaModule ? dfaModule.getAutomatonId() : '') !== this.getAutomatonId();
		const newDfaId =
			isComposite && dfaModule
				? dfaModule.getAutomatonId() + separator + this.getAutomatonId()
				: this.getAutomatonId();

		// Only create a new state if its not composite
		const newStartState =
			(isComposite && dfaModule ? dfaModule.automaton.start_state.toString() + separator : '') +
			this.automaton.start_state.toString();
		const newFinalStates: Set<string> = new Set();

		if (dfaModule) {
			dfaModule.automaton.states.forEach((dfaState) => {
				this.#generateMergedDfaData(
					dfaState,
					newStates,
					newTransitions,
					newFinalStates,
					mergeOperation,
					dfaModule,
					isComposite,
					separator
				);
			});
		} else {
			this.#generateMergedDfaData(
				'',
				newStates,
				newTransitions,
				newFinalStates,
				mergeOperation,
				dfaModule,
				isComposite,
				separator
			);
		}

		if (!isComposite) {
		}

		return new DfaModule(
			(binaryString) => {
				if (mergeOperation === 'or') {
					return (
						(dfaModule ? dfaModule.testLogic(binaryString) : true) || this.testLogic(binaryString)
					);
				} else if (mergeOperation === 'and') {
					return (
						(dfaModule ? dfaModule.testLogic(binaryString) : true) && this.testLogic(binaryString)
					);
				} else {
					return !this.testLogic(binaryString);
				}
			},
			{
				final_states: Array.from(newFinalStates),
				label:
					label ?? `${dfaModule ? dfaModule.automaton.label + ' - ' : ''}${this.automaton.label}`,
				description:
					description ??
					mergeOperation.toUpperCase() +
						'(' +
						`${dfaModule ? dfaModule.automaton.description + ', ' : ''}${
							this.automaton.description
						}` +
						')',
				start_state: isComposite ? newStartState : this.automaton.start_state,
				states: isComposite ? newStates : this.automaton.states,
				transitions: isComposite ? newTransitions : this.automaton.transitions,
			},
			isComposite ? newDfaId : this.getAutomatonId()
		);
	}

	AND(dfaModule: DfaModule, mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'and', mergedDfaOptions);
	}

	NOT(mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(undefined, 'not', mergedDfaOptions);
	}

	OR(dfaModule: DfaModule, mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'or', mergedDfaOptions);
	}
}
