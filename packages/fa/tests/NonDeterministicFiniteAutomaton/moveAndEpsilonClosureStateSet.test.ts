import { moveAndEpsilonClosureStateSet } from '../../libs/NonDeterministicFiniteAutomaton/moveAndEpsilonClosureStateSet';

describe('moveAndEpsilonClosureStateSet', () => {
	it(`Without epsilon transitions record`, () => {
		const epsilonClosuredStates = moveAndEpsilonClosureStateSet(
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
		);
		expect(epsilonClosuredStates).toStrictEqual(['B', 'C']);
	});

	it(`With epsilon transitions record`, () => {
		const epsilonClosuredStates = moveAndEpsilonClosureStateSet(
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
		);
		expect(epsilonClosuredStates).toStrictEqual(['B', 'C', 'A', 'E', 'D']);
	});
});
