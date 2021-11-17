import { generateStateGroupsRecord } from '../../../src/libs/DeterministicFiniteAutomaton/utils/generateStateGroupsRecord';

it(`Should work`, () => {
	expect(
		generateStateGroupsRecord(
			{
				states: ['A', 'B,C', 'E', 'D'],
			},
			[['A'], ['B,C', 'E'], ['D']]
		)
	).toStrictEqual({
		A: 0,
		'B,C': 1,
		D: 2,
		E: 1,
	});
});
