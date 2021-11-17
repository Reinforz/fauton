import { DeterministicFiniteAutomaton } from '..';
import {
	GeneratedAutomatonOptions,
	IFiniteAutomaton,
	TMergeOperation,
	TransformedFiniteAutomaton,
} from '../../../types';
import { generateMergedDfaData } from './generateMergedDfaData';

export function merge(
	automatonId: string,
	sourceFiniteAutomaton: DeterministicFiniteAutomaton,
	targetFiniteAutomaton: DeterministicFiniteAutomaton | undefined,
	mergeOperation: TMergeOperation,
	generatedAutomatonOptions?: GeneratedAutomatonOptions
) {
	const {
		separator = '.',
		label,
		description,
	} = generatedAutomatonOptions ?? ({} as GeneratedAutomatonOptions);
	const newStates: string[] = [];
	const newTransitions: IFiniteAutomaton['automaton']['transitions'] = {};
	// If we have two different dfa's we are in composite mode
	const isComposite = Boolean(
		targetFiniteAutomaton &&
			(targetFiniteAutomaton ? targetFiniteAutomaton.getAutomatonId() : '') !== automatonId
	);

	// If we are in composite mode, we need to generate a new id for the new dfa, by merging the ids of two input dfs separated by a separator
	const newDfaId =
		isComposite && targetFiniteAutomaton
			? automatonId + separator + targetFiniteAutomaton.getAutomatonId()
			: automatonId;

	// Only create a new state if its not composite
	const newStartState =
		isComposite && targetFiniteAutomaton
			? sourceFiniteAutomaton.automaton.start_state +
			  separator +
			  targetFiniteAutomaton.automaton.start_state
			: sourceFiniteAutomaton.automaton.start_state;
	const newFinalStates: Set<string> = new Set();

	// If we have a input dfa, for operations like AND and OR
	if (targetFiniteAutomaton) {
		targetFiniteAutomaton.automaton.states.forEach((state) => {
			generateMergedDfaData(
				sourceFiniteAutomaton.automaton,
				state,
				newStates,
				newTransitions,
				newFinalStates,
				mergeOperation,
				targetFiniteAutomaton,
				isComposite,
				separator
			);
		});
	}
	// If we dont have an input dfa, for operations like NOT, which acts on the dfa itself
	else {
		generateMergedDfaData(
			sourceFiniteAutomaton.automaton,
			'',
			newStates,
			newTransitions,
			newFinalStates,
			mergeOperation,
			targetFiniteAutomaton,
			isComposite,
			separator
		);
	}
	return new DeterministicFiniteAutomaton(
		(inputString, automatonTestResult) => {
			if (mergeOperation === 'or') {
				return (
					targetFiniteAutomaton!.testLogic(inputString, automatonTestResult) ||
					sourceFiniteAutomaton.testLogic(inputString, automatonTestResult)
				);
			}
			if (mergeOperation === 'and') {
				return (
					targetFiniteAutomaton!.testLogic(inputString, automatonTestResult) &&
					sourceFiniteAutomaton.testLogic(inputString, automatonTestResult)
				);
			}
			return !sourceFiniteAutomaton.testLogic(inputString, automatonTestResult);
		},
		{
			final_states: Array.from(newFinalStates),
			label:
				label ??
				`${mergeOperation}(` +
					`${sourceFiniteAutomaton.automaton.label}${mergeOperation !== 'not' ? ', ' : ''}${
						targetFiniteAutomaton ? targetFiniteAutomaton.automaton.label : ''
					}` +
					`)`,
			description:
				description ??
				`${mergeOperation.toUpperCase()}(` +
					`${sourceFiniteAutomaton.automaton.description}${mergeOperation !== 'not' ? ', ' : ''}${
						targetFiniteAutomaton ? targetFiniteAutomaton.automaton.description : ''
					}` +
					`)`,
			start_state: isComposite ? newStartState : sourceFiniteAutomaton.automaton.start_state,
			states: isComposite
				? newStates
				: JSON.parse(JSON.stringify(sourceFiniteAutomaton.automaton.states)),
			transitions: (isComposite
				? newTransitions
				: // Making a new copy of current automata's transitions record
				  JSON.parse(
						JSON.stringify(sourceFiniteAutomaton.automaton.transitions)
				  )) as TransformedFiniteAutomaton['transitions'],
			alphabets: sourceFiniteAutomaton.automaton.alphabets,
			epsilon_transitions: null,
		},
		isComposite ? newDfaId : automatonId
	);
}
