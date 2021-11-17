import {
	IAutomatonTestLogicFn,
	IFiniteAutomaton,
	TransformedFiniteAutomaton,
} from '../../../types';
import { checkEquivalenceBetweenStatesGroups } from './checkEquivalenceBetweenStatesGroups';
import { generateEquivalenceStates } from './generateEquivalenceStates';
import { generateStateGroupsRecord } from './generateStateGroupsRecord';

export function minimize(
	testLogic: IAutomatonTestLogicFn,
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
	const finalStateString = automaton.final_states.join('');
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

	const stateGroupsRecord = generateStateGroupsRecord(automaton, currentEquivalentStatesGroups);
	const newStateState = currentEquivalentStatesGroups.find((stateGroup) =>
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

	return {
		testLogic,
		automaton: {
			label: minimizedDfaOptions?.label ?? automaton.label,
			alphabets: automaton.alphabets,
			description: minimizedDfaOptions?.description ?? automaton.description,
			final_states: [finalStateString],
			start_state: newStateState?.join('') ?? automaton.start_state,
			states: currentEquivalentStatesGroups.map((currentEquivalentStatesGroup) =>
				currentEquivalentStatesGroup.join('')
			),
			transitions: newTransitions,
			epsilon_transitions: null,
		},
	};
}
