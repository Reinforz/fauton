/* eslint-disable no-param-reassign */
import {
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../../../types';

export function generatePreNormalizationErrors(
	testLogic: IAutomatonTestLogicFn,
	automatonType: TFiniteAutomatonType,
	automaton: InputFiniteAutomaton | TransformedFiniteAutomaton
) {
	const automatonValidationErrors: string[] = [];
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
	if (automatonType === 'deterministic') {
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
