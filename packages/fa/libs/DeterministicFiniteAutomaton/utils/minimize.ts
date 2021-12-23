import { IFiniteAutomaton, TransformedFiniteAutomaton } from '../../types';
import { checkEquivalenceBetweenStatesGroups } from './checkEquivalenceBetweenStatesGroups';
import { generateEquivalenceStates } from './generateEquivalenceStates';
import { generateStateGroupsRecord } from './generateStateGroupsRecord';

export function minimize(
	automaton: TransformedFiniteAutomaton,
	minimizedDfaOptions?: Pick<
		Pick<IFiniteAutomaton, 'automaton'>['automaton'],
		'label' | 'description'
	>
) {
	const finalStatesSet: Set<string> = new Set(automaton.final_states);
	const nonFinalStates: string[] = [];
	automaton.states.forEach((state) => {
		if (!finalStatesSet.has(state)) {
			nonFinalStates.push(state);
		}
	});
	let currentEquivalentStatesGroups: string[][] = [nonFinalStates, automaton.final_states];
	let previousEquivalentStatesGroups: string[][] = [];
	let shouldStop = false;
	while (!shouldStop) {
		previousEquivalentStatesGroups = currentEquivalentStatesGroups;
		currentEquivalentStatesGroups = generateEquivalenceStates(
			automaton,
			currentEquivalentStatesGroups
		);
		shouldStop = checkEquivalenceBetweenStatesGroups([
			currentEquivalentStatesGroups,
			previousEquivalentStatesGroups,
		]);
	}

	const stateGroupsRecord = generateStateGroupsRecord(
		automaton.states,
		currentEquivalentStatesGroups
	);
	const newStartState = currentEquivalentStatesGroups.find((stateGroup) =>
		stateGroup.includes(automaton.start_state)
	);

	const newTransitions: IFiniteAutomaton['automaton']['transitions'] = {};
	currentEquivalentStatesGroups.forEach((currentEquivalentStatesGroup) => {
		// ["AC"] => A, since in a group they will have the same transitions for a symbol
		const [firstState] = currentEquivalentStatesGroup;
		const newState = currentEquivalentStatesGroup.join('');
		newTransitions[newState] = {};
		automaton.alphabets.forEach((symbol) => {
			newTransitions[newState][symbol] = [
				currentEquivalentStatesGroups[
					stateGroupsRecord[automaton.transitions[firstState][symbol][0]]
				].join(''),
			];
		});
	});

	const newStates = currentEquivalentStatesGroups.map((currentEquivalentStatesGroup) =>
		currentEquivalentStatesGroup.join('')
	);

	return {
		label: minimizedDfaOptions?.label ?? automaton.label,
		alphabets: automaton.alphabets,
		description: minimizedDfaOptions?.description ?? automaton.description,
		final_states: newStates.filter((newState) =>
			// Checking if the new state should be part of the final states
			automaton.final_states.find((finalState) => newState.includes(finalState))
		),
		start_state: newStartState!.join(''),
		states: newStates,
		transitions: newTransitions,
		epsilon_transitions: null,
	} as IFiniteAutomaton['automaton'];
}
