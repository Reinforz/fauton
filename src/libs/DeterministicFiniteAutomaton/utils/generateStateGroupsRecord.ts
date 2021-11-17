import { TransformedFiniteAutomaton } from '../../../types';

export function generateStateGroupsRecord(
	automaton: Pick<TransformedFiniteAutomaton, 'states'>,
	stateGroups: string[][]
) {
	const stateGroupsRecord: Record<string, number> = {};
	const allStatesSet: Set<string> = new Set(automaton.states);
	stateGroups.forEach((stateGroup, stateGroupIndex) => {
		// State group would contain combinations of states
		stateGroup.forEach((state) => {
			// Since states could be joined by , or other separators
			// We should check whether the character actually is a state
			if (allStatesSet.has(state)) {
				stateGroupsRecord[state] = stateGroupIndex;
			}
		});
	});
	return stateGroupsRecord;
}
