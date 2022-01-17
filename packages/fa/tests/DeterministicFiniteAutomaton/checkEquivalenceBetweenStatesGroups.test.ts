import { checkEquivalenceBetweenStatesGroups } from '../../libs/DeterministicFiniteAutomaton/checkEquivalenceBetweenStatesGroups';

describe('checkEquivalenceBetweenStatesGroups', () => {
	it(`Detect equivalency between state groups`, () => {
		const stateGroupEquivalency = checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[['1', '2'], ['4'], ['3', '5']],
		]);
		expect(stateGroupEquivalency).toStrictEqual(true);
	});

	it(`Detect non-equivalency with same length`, () => {
		// For different length of state groups
		const stateGroupEquivalency = checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[['1', '2'], ['3', '5'], ['1']],
		]);
		expect(stateGroupEquivalency).toStrictEqual(false);
	});

	it(`Detect non-equivalency with different length`, () => {
		const stateGroupEquivalency = checkEquivalenceBetweenStatesGroups([
			[['3', '5'], ['4'], ['1', '2']],
			[['4'], ['3', '5']],
		]);
		expect(stateGroupEquivalency).toStrictEqual(false);
	});
});
