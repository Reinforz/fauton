import { GeneratedAutomatonOptions, IFiniteAutomaton, TransformedFiniteAutomaton } from '../types';
import { epsilonClosureOfState } from './epsilonClosureOfState';
import { moveAndEpsilonClosureStateSet } from './moveAndEpsilonClosureStateSet';

/**
 * Convert a e-nfa/nfa to a dfa
 * @param automaton e/nfa to convert
 * @param generatedAutomatonOptions Options for the newly generated dfa
 * @returns data to construct a dfa
 */
export function convertToDeterministicFiniteAutomaton(
	automaton: TransformedFiniteAutomaton,
	generatedAutomatonOptions?: GeneratedAutomatonOptions
) {
	const separator = generatedAutomatonOptions?.separator ?? ',';
	const startState = automaton.start_state;
	const newStartStates = automaton.epsilon_transitions
		? epsilonClosureOfState(automaton.epsilon_transitions, startState)
		: [automaton.start_state];
	const newStartStateString = newStartStates.sort().join(separator);
	const newStates: Set<string> = new Set();
	const unmarkedStates: string[] = [newStartStateString];
	const newTransitionsRecord: IFiniteAutomaton['automaton']['transitions'] = {};
	const totalAlphabets = automaton.alphabets.length;
	const newFinalStates: Set<string> = new Set();
	newStates.add(newStartStateString);
	let hasDeadState = false;
	while (unmarkedStates.length !== 0) {
		const currentStatesString = unmarkedStates.shift()!;
		for (let symbolIndex = 0; symbolIndex < automaton.alphabets.length; symbolIndex += 1) {
			const symbol = automaton.alphabets[symbolIndex];
			const newStateString = moveAndEpsilonClosureStateSet(
				automaton.transitions,
				automaton.epsilon_transitions,
				currentStatesString!.split(separator),
				symbol
			)
				.sort()
				.join(separator);
			if (!newStates.has(newStateString) && newStateString) {
				newStates.add(newStateString);
				unmarkedStates.push(newStateString);
			}
			// If the epsilon closure of the state is empty, its a trap state
			if (!newStateString) {
				hasDeadState = true;
				newStates.add(`Ø`);
			}
			if (!newTransitionsRecord[currentStatesString]) {
				newTransitionsRecord[currentStatesString] = new Array(totalAlphabets).fill(null) as any;
			}
			if (newStateString) newTransitionsRecord[currentStatesString][symbolIndex] = [newStateString];
			else {
				newTransitionsRecord[currentStatesString][symbolIndex] = [`Ø`];
			}
		}
	}

	// Checking if the new state string should be a final state
	automaton.final_states.forEach((finalState) => {
		newStates.forEach((newState) => {
			if (newState.includes(finalState)) {
				newFinalStates.add(newState);
			}
		});
	});

	if (hasDeadState) {
		newTransitionsRecord['Ø'] = new Array(totalAlphabets).fill('Ø') as any;
	}

	return {
		alphabets: automaton.alphabets,
		final_states: Array.from(newFinalStates),
		label: generatedAutomatonOptions?.label ?? automaton.label,
		start_state: newStartStateString,
		states: Array.from(newStates),
		transitions: newTransitionsRecord,
		epsilon_transitions: null,
		description: generatedAutomatonOptions?.description ?? automaton.description,
	} as IFiniteAutomaton['automaton'];
}
