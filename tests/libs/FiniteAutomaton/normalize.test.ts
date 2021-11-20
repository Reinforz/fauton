import { normalize } from '../../../src/libs/FiniteAutomaton/utils/normalize';

it(`Should normalize input finite automaton e-nfa without append`, () => {
	const normalizedFiniteAutomaton = normalize({
		alphabets: ['a-c', 'e'],
		final_states: ['0-1'],
		label: 'DFA',
		start_state: 0,
		states: ['0-4'],
		transitions: {
			1: ['1-5', '2-3'],
			2: [2, ['2-4', 4, 4, 5]],
			3: [null, 3],
		},
		epsilon_transitions: {
			0: [1],
			1: ['1-3', '3', 4],
			4: [2],
		},
	});

	expect(normalizedFiniteAutomaton).toStrictEqual({
		alphabets: ['a', 'b', 'c', 'e'],
		final_states: ['0', '1'],
		label: 'DFA',
		states: ['0', '1', '2', '3', '4'],
		start_state: '0',
		epsilon_transitions: {
			0: ['1'],
			1: ['1', '2', '3', '4'],
			4: ['2'],
		},
		transitions: {
			'1': {
				a: ['1', '2', '3', '4', '5'],
				b: ['2', '3'],
			},
			'2': {
				a: ['2'],
				b: ['2', '3', '4', '5'],
			},
			'3': {
				b: ['3'],
			},
		},
	});
});

it(`Should normalize input finite automaton without append`, () => {
	const normalizedFiniteAutomaton = normalize({
		alphabets: [0, 1],
		final_states: [0, 1],
		label: 'DFA',
		start_state: 0,
		states: [0, 1, 2, 3],
		transitions: {
			0: [0, 1],
			1: [1, 2],
			2: [2, 3],
			3: [3, 3],
		},
	});

	expect(normalizedFiniteAutomaton).toStrictEqual({
		alphabets: ['0', '1'],
		final_states: ['0', '1'],
		label: 'DFA',
		states: ['0', '1', '2', '3'],
		start_state: '0',
		transitions: {
			'0': {
				0: ['0'],
				1: ['1'],
			},
			'1': {
				0: ['1'],
				1: ['2'],
			},
			'2': {
				0: ['2'],
				1: ['3'],
			},
			'3': {
				0: ['3'],
				1: ['3'],
			},
		},
	});
});

it(`Should normalize input finite automaton with append`, () => {
	const normalizedFiniteAutomaton = normalize({
		alphabets: ['a', 'b'],
		final_states: [0, 1],
		label: 'DFA',
		start_state: 0,
		states: [0, 1, 2, 3],
		append: 'Q',
		transitions: {
			0: [0, 1],
			1: [1, 2],
			2: [2, 3],
			3: 'loop',
		},
	});

	expect(normalizedFiniteAutomaton).toStrictEqual({
		alphabets: ['a', 'b'],
		final_states: ['Q0', 'Q1'],
		label: 'DFA',
		states: ['Q0', 'Q1', 'Q2', 'Q3'],
		start_state: 'Q0',
		transitions: {
			Q0: {
				a: ['Q0'],
				b: ['Q1'],
			},
			Q1: {
				a: ['Q1'],
				b: ['Q2'],
			},
			Q2: {
				a: ['Q2'],
				b: ['Q3'],
			},
			Q3: {
				a: ['Q3'],
				b: ['Q3'],
			},
		},
	});
});
