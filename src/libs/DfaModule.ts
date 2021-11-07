import colors from 'colors';
import { IBinaryDFA } from '../types';

export class DfaModule {
	testLogic: (binaryString: string) => boolean;
	DFA: IBinaryDFA;

	constructor(testLogic: (binaryString: string) => boolean, DFA: IBinaryDFA) {
		this.testLogic = testLogic;
		this.DFA = DFA;
		this.validate();
	}

	validate() {
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
				errors.push(`Dfa transitions value, when a tuple can contain only 2 items`);
			}

			if (typeof transitionValues === 'string' && transitionValues !== 'loop') {
				errors.push(`Dfa transitions value, when a string can only be "loop"`);
			}

			if (Array.isArray(transitionValues)) {
				transitionValues.forEach((transitionValue) => {
					if (!DFA.states.includes(transitionValue)) {
						errors.push(`Dfa transitions value, when a tuple must reference a valid state`);
					}
				});
			}
		});

		return errors;
	}
}
