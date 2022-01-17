import { epsilonClosureOfState } from '../../libs/NonDeterministicFiniteAutomaton/epsilonClosureOfState';

describe('epsilonClosureOfState', () => {
	it(`Epsilon closure of state`, () => {
		const epsilonClosuredStates = epsilonClosureOfState(
			{
				A: ['B'],
				B: ['C', 'D'],
			},
			'A'
		);
		expect(epsilonClosuredStates).toStrictEqual(['A', 'B', 'C', 'D']);
	});
});

it(`Should generate epsilon closure of a state`, () => {});
