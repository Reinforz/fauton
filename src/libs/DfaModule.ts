import colors from 'colors';
import { IDfaModule, InputBinaryDFA, TransformedBinaryDFA } from '../types';

type IMergedDfaOptions = Partial<Pick<Pick<IDfaModule, 'DFA'>['DFA'], 'label' | 'description'>>;
type TMergeOperation = 'or' | 'and' | 'not';
export class DfaModule {
	testLogic: (binaryString: string) => boolean;
	DFA: TransformedBinaryDFA;

	constructor(testLogic: (binaryString: string) => boolean, DFA: InputBinaryDFA) {
		this.testLogic = testLogic;
		this.DFA = this.#normalize(DFA);
		this.#validate();
	}

	#normalize(DFA: InputBinaryDFA) {
		DFA.final_states = DFA.final_states.map(
			(finalState) => (DFA.append ?? '') + finalState.toString()
		);
		DFA.start_state = (DFA.append ?? '') + DFA.start_state.toString();
		DFA.states = DFA.states.map((state) => (DFA.append ?? '') + state.toString());
		Object.entries(DFA.transitions).forEach(([transitionKey, transitionValues]) => {
			const transformedTransitionValues =
				typeof transitionValues !== 'string'
					? transitionValues.map(
							(transitionValue) => (DFA.append ?? '') + transitionValue.toString()
					  )
					: (transitionValues as any);

			delete DFA.transitions[transitionKey];
			DFA.transitions[(DFA.append ?? '') + transitionKey] = transformedTransitionValues;
		});

		return DFA as TransformedBinaryDFA;
	}

	#validate() {
		const dfaModuleValidationErrors = this.generateErrors();
		if (dfaModuleValidationErrors.length !== 0) {
			console.log(
				`${colors.blue.bold(this.DFA.label)} ${colors.red.bold(
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
		const { testLogic, DFA } = this;
		if (!testLogic) {
			errors.push('testLogic function is required in dfa module');
		}

		if (!DFA.label) {
			errors.push('Dfa label is required');
		}

		if (!DFA.states) {
			errors.push('Dfa states is required');

			// Required when checking final_states and transition tuple states
			DFA.states = [];
		}

		if (!Array.isArray(DFA.states)) {
			errors.push('Dfa states must be an array');
		}

		if (DFA.states.length === 0) {
			errors.push('Dfa states must be an array of length > 0');
		}

		DFA.states.forEach((state) => {
			if (!DFA.transitions[state]) {
				errors.push(`Dfa states must reference a state (${state}) that is present in transitions`);
			}
		});

		if (DFA.start_state === undefined || DFA.start_state === null) {
			errors.push('Dfa start_state is required');
		}

		if (DFA.final_states === undefined || DFA.final_states === null) {
			errors.push('Dfa final_states is required');
			DFA.final_states = [];
		}

		if (!Array.isArray(DFA.final_states)) {
			errors.push('Dfa final_states must be an array');
		}

		if (DFA.final_states.length === 0) {
			errors.push('Dfa final_states must be an array of length > 0');
		}

		DFA.final_states.forEach((state) => {
			if (!DFA.states.includes(state)) {
				errors.push(`Dfa final_states must reference a state (${state}) that is present in states`);
			}
		});

		Object.entries(DFA.transitions).forEach(([transitionKey, transitionValues]) => {
			if (!DFA.states.includes(transitionKey)) {
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
					if (!DFA.states.includes(transitionValue)) {
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
		newTransitions: IDfaModule['DFA']['transitions'],
		newFinalStates: string[],
		mergeOperation: TMergeOperation,
		dfaModule?: DfaModule
	) {
		this.DFA.states.forEach((currentDfaState) => {
			const newState = `${dfaState}${currentDfaState}`;
			newStates.push(newState);
			const newStateForSymbolZero =
				(dfaModule ? dfaModule.DFA.transitions[dfaState][0].toString() : '') +
				this.DFA.transitions[currentDfaState][0].toString();
			const newStateForSymbolOne =
				(dfaModule ? dfaModule.DFA.transitions[dfaState][1].toString() : '') +
				this.DFA.transitions[currentDfaState][1].toString();
			newTransitions[newState] = [newStateForSymbolZero, newStateForSymbolOne];
			if (
				mergeOperation === 'or' &&
				((dfaModule ? dfaModule.DFA.final_states.includes(dfaState) : true) ||
					this.DFA.final_states.includes(currentDfaState))
			) {
				newFinalStates.push(newState);
			} else if (
				mergeOperation === 'and' &&
				(dfaModule ? dfaModule.DFA.final_states.includes(dfaState) : true) &&
				this.DFA.final_states.includes(currentDfaState)
			) {
				newFinalStates.push(newState);
			} else if (mergeOperation === 'not' && !this.DFA.final_states.includes(currentDfaState)) {
				newFinalStates.push(newState);
			}
		});
	}

	#merge(
		dfaModule: DfaModule | undefined,
		mergeOperation: TMergeOperation,
		mergedDfaOptions?: IMergedDfaOptions
	) {
		const newStates: string[] = [];
		const newTransitions: IDfaModule['DFA']['transitions'] = {};
		const newStartState =
			(dfaModule ? dfaModule.DFA.start_state.toString() : '') + this.DFA.start_state.toString();
		const newFinalStates: string[] = [];

		if (dfaModule) {
			dfaModule.DFA.states.forEach((dfaState) => {
				this.#generateMergedDfaData(
					dfaState,
					newStates,
					newTransitions,
					newFinalStates,
					mergeOperation,
					dfaModule
				);
			});
		} else {
			this.#generateMergedDfaData(
				'',
				newStates,
				newTransitions,
				newFinalStates,
				mergeOperation,
				dfaModule
			);
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
				final_states: newFinalStates,
				label:
					mergedDfaOptions?.label ??
					`${dfaModule ? dfaModule.DFA.label + ' - ' : ''}${this.DFA.label}`,
				description:
					mergedDfaOptions?.description ??
					mergeOperation.toUpperCase() +
						'(' +
						`${dfaModule ? dfaModule.DFA.description + ', ' : ''}${this.DFA.description}` +
						')',
				start_state: newStartState,
				states: newStates,
				transitions: newTransitions,
			}
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
