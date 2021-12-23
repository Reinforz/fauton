import { generatePostNormalizationErrors } from '../../libs/FiniteAutomaton/utils/generatePostNormalizationErrors';

it(`Should not generate any errors`, () => {
	expect(
		generatePostNormalizationErrors({
			alphabets: ['a', 'b'],
			final_states: ['0', '1'],
			label: 'DFA',
			start_state: '0',
			states: ['0', '1', '2'],
			transitions: {
				0: {
					a: ['1'],
					b: ['2'],
				},
				1: {
					a: ['2'],
					b: ['1'],
				},
				2: {
					a: ['2'],
					b: ['2'],
				},
			},
			epsilon_transitions: null,
		}).length
	).toStrictEqual(0);
});

it(`Should generate errors`, () => {
	expect(
		generatePostNormalizationErrors({
			alphabets: ['a', 'b'],
			final_states: ['0', '3'],
			label: 'DFA',
			start_state: '0',
			states: ['0', '1', '2'],
			transitions: {
				0: {
					a: ['1'],
					b: ['2'],
				},
				1: {
					a: ['2'],
					b: ['1'],
				},
				2: {
					a: ['2'],
					b: ['2'],
				},
				3: {
					c: ['4'],
				},
			},
			epsilon_transitions: {
				1: ['2'],
				2: ['0', '3'],
				3: ['1'],
			},
		})
	).toStrictEqual([
		`Automaton final_states must reference a state (3) that is present in states`,
		`Epsilon transitions state 2 must reference a state 3 that is present in states`,
		`Epsilon transitions state 3 must reference a state that is present in states`,
		`Automaton transitions (3) must reference a state that is present in states`,
		`Automaton transitions symbol (c), must reference a valid alphabet`,
		`Automaton transitions value (4) when a tuple, must reference a valid state`,
	]);
});
