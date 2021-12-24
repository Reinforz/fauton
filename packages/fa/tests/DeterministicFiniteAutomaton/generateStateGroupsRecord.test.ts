import { generateStateGroupsRecord } from '../../libs/DeterministicFiniteAutomaton/generateStateGroupsRecord';

it(`Should work`, () => {
	expect(
		generateStateGroupsRecord(['A', 'B,C', 'E', 'D'], [['A'], ['B,C', 'E'], ['D']])
	).toStrictEqual({
		A: 0,
		'B,C': 1,
		D: 2,
		E: 1,
	});
});
