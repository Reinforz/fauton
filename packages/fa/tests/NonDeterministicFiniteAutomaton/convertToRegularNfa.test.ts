import { convertToRegularNfa } from '../../libs/NonDeterministicFiniteAutomaton/convertToRegularNfa';

describe('convertToRegularNfa', () => {
	it(`Converting e-nfa to nfa`, () => {
		const transitions = {
			A: {
				0: ['A'],
			},
			B: {
				1: ['B'],
			},
			C: {
				0: ['C'],
				1: ['C'],
			},
		};
		convertToRegularNfa({
			alphabets: ['0', '1'],
			epsilon_transitions: {
				A: ['B'],
				B: ['C'],
				D: ['C'],
			},
			states: ['A', 'B', 'C', 'D'],
			transitions,
		});
		expect(transitions).toStrictEqual({
			A: {
				0: ['A', 'C', 'B'],
				1: ['B', 'C'],
			},
			B: {
				0: ['C'],
				1: ['B', 'C'],
			},
			C: {
				0: ['C'],
				1: ['C'],
			},
			D: {
				0: ['C'],
				1: ['C'],
			},
		});
	});
});
