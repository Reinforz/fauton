import { TransformedFiniteAutomaton } from '../types';

export function generatePostNormalizationErrors(automaton: TransformedFiniteAutomaton) {
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
			([transitionStartState, transitionTargetStates]) => {
				if (!automatonStates.has(transitionStartState)) {
					automatonValidationErrors.push(
						`Epsilon transitions state ${transitionStartState} must reference a state that is present in states`
					);
				}
				transitionTargetStates.forEach((transitionTargetState) => {
					if (!automatonStates.has(transitionTargetState)) {
						automatonValidationErrors.push(
							`Epsilon transitions state ${transitionStartState} must reference a state ${transitionTargetState} that is present in states`
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

		// all of these must refer to valid states
		if (transitionStatesRecord) {
			Object.entries(transitionStatesRecord).forEach(
				([transitionStateSymbol, transitionStateTargetStates]) => {
					if (!automatonAlphabets.has(transitionStateSymbol)) {
						automatonValidationErrors.push(
							`Automaton transitions symbol (${transitionStateSymbol}), must reference a valid alphabet`
						);
					}
					transitionStateTargetStates.forEach((transitionStateTargetState) => {
						if (!automatonStates.has(transitionStateTargetState)) {
							automatonValidationErrors.push(
								`Automaton transitions value (${transitionStateTargetState}) when a tuple, must reference a valid state`
							);
						}
					});
				}
			);
		}
	});

	return automatonValidationErrors;
}
