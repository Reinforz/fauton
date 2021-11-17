import { TransformedFiniteAutomaton } from '../../../types';
import { generateStateGroupsRecord } from './generateStateGroupsRecord';

export function generateEquivalenceStates(
	automaton: Pick<TransformedFiniteAutomaton, 'states' | 'alphabets' | 'transitions'>,
	stateGroups: string[][]
) {
	const stateGroupsRecord = generateStateGroupsRecord(automaton, stateGroups);
	const stateGroupsSymbolsRecord: Record<string, string[]> = {};
	// Segregating state groups based on its length
	const singleStateGroups: string[][] = [];
	const compositeStateGroups: string[][] = [];
	stateGroups.forEach((stateGroup) => {
		if (stateGroup.length > 1) {
			compositeStateGroups.push(stateGroup);
		} else {
			singleStateGroups.push(stateGroup);
		}
	});
	// Looping through only composite state groups as only they can be broken down further
	compositeStateGroups.forEach((compositeStateGroup) => {
		compositeStateGroup.forEach((state) => {
			// Each combination of state group (for each symbol) we will be the key
			let stateGroup = '';
			automaton.alphabets.forEach((symbol) => {
				stateGroup += stateGroupsRecord[automaton.transitions[state][symbol].toString()];
			});
			if (!stateGroupsSymbolsRecord[stateGroup]) {
				stateGroupsSymbolsRecord[stateGroup] = [state];
			} else {
				stateGroupsSymbolsRecord[stateGroup].push(state);
			}
		});
	});
	// Attaching the single state groups as they were not present in the record
	return Object.values(stateGroupsSymbolsRecord).concat(singleStateGroups);
}
