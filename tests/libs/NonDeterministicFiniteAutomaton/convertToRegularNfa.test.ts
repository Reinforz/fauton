import { convertToRegularNfa } from '../../../src/libs/NonDeterministicFiniteAutomaton/utils/convertToRegularNfa';
import { IFiniteAutomaton } from '../../../src/types';

it(`Should convert epsilon-nfa to regular nfa`, () => {
	const transitions: IFiniteAutomaton['automaton']['transitions'] = {
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
			0: ['A', 'B', 'C'],
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
