import { convertToDeterministicFiniteAutomaton } from '../../../src/libs/NonDeterministicFiniteAutomaton/utils/convertToDeterministicFiniteAutomaton';

it(`Should work for regular nfa`, () => {
	expect(
		convertToDeterministicFiniteAutomaton(
			{
				start_state: 'q0',
				alphabets: ['a', 'b'],
				final_states: ['q1'],
				label: 'sample nfa',
				states: ['q0', 'q1', 'q2'],
				transitions: {
					q0: {
						a: ['q2', 'q1'],
					},
					q2: {
						a: ['q2', 'q1'],
						b: ['q2'],
					},
				},
				epsilon_transitions: null,
			},
			{
				description: 'New Description',
				label: 'New label',
				separator: '-',
			}
		)
	).toStrictEqual({
		epsilon_transitions: null,
		alphabets: ['a', 'b'],
		final_states: ['q1-q2'],
		start_state: 'q0',
		states: ['q0', 'q1-q2', 'Ø', 'q2'],
		transitions: {
			q0: [['q1-q2'], ['Ø']],
			'q1-q2': [['q1-q2'], ['q2']],
			q2: [['q1-q2'], ['q2']],
			Ø: ['Ø', 'Ø'],
		},
		description: 'New Description',
		label: 'New label',
	});
});

it(`Should work for regular e-nfa`, () => {
	expect(
		convertToDeterministicFiniteAutomaton({
			start_state: 'q0',
			alphabets: ['a', 'b'],
			final_states: ['q1'],
			label: 'sample nfa',
			states: ['q0', 'q1', 'q2'],
			transitions: {
				q0: {
					a: ['q2', 'q1'],
				},
				q2: {
					a: ['q2', 'q1'],
					b: ['q2'],
				},
			},
			epsilon_transitions: {
				q0: ['q1'],
			},
		})
	).toStrictEqual({
		description: undefined,
		epsilon_transitions: null,
		alphabets: ['a', 'b'],
		final_states: ['q0,q1', 'q1,q2'],
		label: 'sample nfa',
		start_state: 'q0,q1',
		states: ['q0,q1', 'q1,q2', 'Ø', 'q2'],
		transitions: {
			'q0,q1': [['q1,q2'], ['Ø']],
			'q1,q2': [['q1,q2'], ['q2']],
			q2: [['q1,q2'], ['q2']],
			Ø: ['Ø', 'Ø'],
		},
	});
});
