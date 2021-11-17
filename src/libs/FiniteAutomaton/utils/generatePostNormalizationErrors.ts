import { TFiniteAutomatonType, TransformedFiniteAutomaton } from '../../../types';

export function generatePostNormalizationErrors(
	automatonType: TFiniteAutomatonType,
	automaton: TransformedFiniteAutomaton
) {
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
						`Epsilon transition state ${transitionStartState} must reference a state that is present in states`
					);
				}
				transitionTargetStates.forEach((transitionTargetState) => {
					if (!automatonStates.has(transitionTargetState)) {
						automatonValidationErrors.push(
							`Epsilon transition state ${transitionTargetState} must reference a state that is present in states`
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

		if (automatonType === 'deterministic') {
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
