import {
	GeneratedAutomatonOptions,
	IFiniteAutomaton,
	TMergeOperation,
	TransformedFiniteAutomaton,
} from '../../../types';

export function merge(
	sourceAutomaton: IFiniteAutomaton,
	targetAutomaton: IFiniteAutomaton | undefined,
	mergeOperation: TMergeOperation,
	generatedAutomatonOptions?: GeneratedAutomatonOptions
) {
	const {
		separator = '.',
		label,
		description,
	} = generatedAutomatonOptions ?? ({} as GeneratedAutomatonOptions);

	const sourceAutomatonFinalStates = new Set(sourceAutomaton.automaton.final_states);
	const targetAutomatonFinalStates = new Set(
		targetAutomaton ? targetAutomaton.automaton.final_states : []
	);
	const newStates: string[] = [];
	const newTransitions: IFiniteAutomaton['automaton']['transitions'] = {};
	const newFinalStates: Set<string> = new Set();

	// If we have two different dfa's we are in composite mode
	const isComposite = Boolean(
		targetAutomaton &&
			(targetAutomaton ? targetAutomaton.automatonId : '') !== sourceAutomaton.automatonId
	);

	// If we are in composite mode, we need to generate a new id for the new dfa, by merging the ids of two input dfs separated by a separator
	const newDfaId =
		isComposite && targetAutomaton
			? sourceAutomaton.automatonId + separator + targetAutomaton.automatonId
			: sourceAutomaton.automatonId;

	// Only create a new state if its not composite
	const newStartState =
		isComposite && targetAutomaton
			? sourceAutomaton.automaton.start_state + separator + targetAutomaton.automaton.start_state
			: sourceAutomaton.automaton.start_state;

	function inner(targetAutomatonState?: string) {
		sourceAutomaton.automaton.states.forEach((sourceAutomatonState) => {
			const newState = isComposite
				? `${sourceAutomatonState}${separator}${targetAutomatonState}`
				: sourceAutomatonState;
			if (isComposite && targetAutomatonState) {
				newStates.push(newState);
				newTransitions[newState] = {};
				sourceAutomaton.automaton.alphabets.forEach((automatonAlphabet) => {
					newTransitions[newState][automatonAlphabet] = [
						sourceAutomaton.automaton.transitions[sourceAutomatonState][automatonAlphabet] +
							separator +
							(targetAutomaton
								? targetAutomaton.automaton.transitions[targetAutomatonState][automatonAlphabet]
								: ''),
					];
				});
				if (
					mergeOperation === 'or' &&
					((targetAutomaton ? targetAutomatonFinalStates.has(targetAutomatonState) : true) ||
						sourceAutomatonFinalStates.has(sourceAutomatonState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(targetAutomaton ? targetAutomatonFinalStates.has(targetAutomatonState) : true) &&
					sourceAutomatonFinalStates.has(sourceAutomatonState)
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'not' &&
					!sourceAutomatonFinalStates.has(sourceAutomatonState)
				) {
					newFinalStates.add(newState);
				}
			} else if (
				mergeOperation === 'or' &&
				((targetAutomaton ? targetAutomatonFinalStates.has(newState) : true) ||
					sourceAutomatonFinalStates.has(newState))
			) {
				newFinalStates.add(newState);
			} else if (
				mergeOperation === 'and' &&
				(targetAutomaton ? targetAutomatonFinalStates.has(newState) : true) &&
				sourceAutomatonFinalStates.has(newState)
			) {
				newFinalStates.add(newState);
			} else if (mergeOperation === 'not' && !sourceAutomatonFinalStates.has(newState)) {
				newFinalStates.add(newState);
			}
		});
	}

	if (targetAutomaton) {
		targetAutomaton?.automaton.states.forEach((targetAutomatonState) => {
			inner(targetAutomatonState);
		});
	} else {
		inner();
	}

	return {
		testLogic: (inputString, automatonTestResult) => {
			if (mergeOperation === 'or') {
				return (
					targetAutomaton!.testLogic(inputString, automatonTestResult) ||
					sourceAutomaton.testLogic(inputString, automatonTestResult)
				);
			}
			if (mergeOperation === 'and') {
				return (
					targetAutomaton!.testLogic(inputString, automatonTestResult) &&
					sourceAutomaton.testLogic(inputString, automatonTestResult)
				);
			}
			return !sourceAutomaton.testLogic(inputString, automatonTestResult);
		},
		automaton: {
			final_states: Array.from(newFinalStates),
			label:
				label ??
				`${mergeOperation}(` +
					`${sourceAutomaton.automaton.label}${mergeOperation !== 'not' ? ', ' : ''}${
						targetAutomaton ? targetAutomaton.automaton.label : ''
					}` +
					`)`,
			description:
				description ??
				`${mergeOperation.toUpperCase()}(` +
					`${sourceAutomaton.automaton.description}${mergeOperation !== 'not' ? ', ' : ''}${
						targetAutomaton ? targetAutomaton.automaton.description : ''
					}` +
					`)`,
			start_state: isComposite ? newStartState : sourceAutomaton.automaton.start_state,
			states: isComposite
				? newStates
				: JSON.parse(JSON.stringify(sourceAutomaton.automaton.states)),
			transitions: (isComposite
				? newTransitions
				: // Making a new copy of current automata's transitions record
				  JSON.parse(
						JSON.stringify(sourceAutomaton.automaton.transitions)
				  )) as TransformedFiniteAutomaton['transitions'],
			alphabets: sourceAutomaton.automaton.alphabets,
			epsilon_transitions: null,
		},
		automatonId: isComposite ? newDfaId : sourceAutomaton.automatonId,
	} as IFiniteAutomaton;
}
