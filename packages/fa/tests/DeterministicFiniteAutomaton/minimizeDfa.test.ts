import { minimizeDfa } from '../../libs/DeterministicFiniteAutomaton/minimizeDfa';

describe('minimize', () => {
	it(`Minimize dfa where start and end states are different`, () => {
		const minimizedDfa = minimizeDfa(
			{
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
			},
			{
				label: 'New label',
				description: 'New description',
			}
		);
		expect(minimizedDfa).toStrictEqual({
			alphabets: ['0', '1'],
			epsilon_transitions: null,
			final_states: ['2'],
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
			label: 'New label',
			description: 'New description',
		});
	});

	it(`Minimize dfa where start is one of the final states`, () => {
		const minimizedDfa = minimizeDfa({
			epsilon_transitions: null,
			final_states: ['1', '4', '6'],
			label: 'DFA',
			start_state: '1',
			alphabets: ['a', 'b'],
			states: ['1', '2', '3', '4', '5', '6'],
			transitions: {
				1: {
					a: ['3'],
					b: ['6'],
				},
				2: {
					a: ['5'],
					b: ['6'],
				},
				3: {
					a: ['5'],
					b: ['6'],
				},
				4: {
					a: ['2'],
					b: ['6'],
				},
				5: {
					a: ['6'],
					b: ['1'],
				},
				6: {
					a: ['4'],
					b: ['4'],
				},
			},
		});
		expect(minimizedDfa).toStrictEqual({
			description: undefined,
			label: 'DFA',
			alphabets: ['a', 'b'],
			final_states: ['14', '6'],
			start_state: '14',
			states: ['23', '14', '6', '5'],
			transitions: {
				'5': {
					a: ['6'],
					b: ['14'],
				},
				'6': {
					a: ['14'],
					b: ['14'],
				},
				'14': {
					a: ['23'],
					b: ['6'],
				},
				'23': {
					a: ['5'],
					b: ['6'],
				},
			},
			epsilon_transitions: null,
		});
	});
});
