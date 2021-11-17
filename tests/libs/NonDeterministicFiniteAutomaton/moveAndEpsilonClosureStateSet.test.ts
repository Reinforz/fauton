import { moveAndEpsilonClosureStateSet } from '../../../src/libs/NonDeterministicFiniteAutomaton/utils/moveAndEpsilonClosureStateSet';

it(`Should work without epsilon transitions record`, () => {
	expect(
		moveAndEpsilonClosureStateSet(
			{
				A: {
					0: ['B', 'C'],
				},
				B: {
					0: ['C'],
				},
			},
			null,
			['A', 'B'],
			'0'
		)
	).toStrictEqual(['B', 'C']);
});

it(`Should work with epsilon transitions record`, () => {
	expect(
		moveAndEpsilonClosureStateSet(
			{
				A: {
					0: ['B', 'C'],
				},
				B: {
					0: ['C'],
				},
			},
			{
				B: ['A', 'E'],
				C: ['D'],
			},
			['A', 'B'],
			'0'
		)
	).toStrictEqual(['B', 'C', 'A', 'E', 'D']);
});
