import { checkEquivalenceBetweenStatesGroups } from '../../libs/DeterministicFiniteAutomaton/utils/checkEquivalenceBetweenStatesGroups';

it(`Should detect equivalency`, () => {
	expect(
		checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[['1', '2'], ['4'], ['3', '5']],
		])
	).toStrictEqual(true);
});

it(`Should detect non-equivalency`, () => {
	// For different length of state groups
	expect(
		checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[
				['1', '2'],
				['3', '5'],
			],
		])
	).toStrictEqual(false);

	// For different states in state groups
	expect(
		checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[['1'], ['4'], ['3', '5']],
		])
	).toStrictEqual(false);
});
