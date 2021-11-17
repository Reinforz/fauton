/**
 * Generates a record that maps each input states, to its index in the statesGroups
 * @param states An array of states of the automaton
 * @param statesGroups Array of state groups
 * @returns A record which maps each state to its state group index
 */
export function generateStateGroupsRecord(states: string[], statesGroups: string[][]) {
	const statesGroupsRecord: Record<string, number> = {};
	const allStatesSet: Set<string> = new Set(states);
	statesGroups.forEach((statesGroup, statesGroupIndex) => {
		// State group would contain combinations of states
		statesGroup.forEach((state) => {
			// Since states could be joined by , or other separators
			// We should check whether the character actually is a state
			if (allStatesSet.has(state)) {
				statesGroupsRecord[state] = statesGroupIndex;
			}
		});
	});
	return statesGroupsRecord;
}
