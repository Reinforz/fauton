import { minimize } from '../../../src/libs/DeterministicFiniteAutomaton/utils/minimize';

it(`Should minimize dfa`, () => {
	expect(
		minimize({
			epsilon_transitions: null,
			final_states: ['2'],
			label: 'DFA',
			start_state: '0',
			alphabets: ['0', '1'],
			states: ['0', '1', '2', '3', '4', '5', '6', '7'],
			transitions: {
				0: {
					0: ['1'],
					1: ['5'],
				},
				1: {
					0: ['6'],
					1: ['2'],
				},
				2: {
					0: ['0'],
					1: ['2'],
				},
				3: {
					0: ['2'],
					1: ['6'],
				},
				4: {
					0: ['7'],
					1: ['5'],
				},
				5: {
					0: ['2'],
					1: ['6'],
				},
				6: {
					0: ['6'],
					1: ['4'],
				},
				7: {
					0: ['6'],
					1: ['2'],
				},
			},
		})
	).toStrictEqual({
		alphabets: ['0', '1'],
		epsilon_transitions: null,
		final_states: ['2'],
		label: 'DFA',
		start_state: '04',
		states: ['04', '35', '17', '6', '2'],
		transitions: {
			'04': {
				0: ['17'],
				1: ['35'],
			},
			'6': {
				0: ['6'],
				1: ['04'],
			},
			'17': {
				0: ['6'],
				1: ['2'],
			},
			'35': {
				0: ['2'],
				1: ['6'],
			},
			'2': {
				0: ['04'],
				1: ['2'],
			},
		},
		description: undefined,
	});
});
