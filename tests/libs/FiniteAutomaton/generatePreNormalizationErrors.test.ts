import { generatePreNormalizationErrors } from '../../../src/libs/FiniteAutomaton/utils/generatePreNormalizationErrors';

it(`Should not generate any errors`, () => {
	const generatedErrors = generatePreNormalizationErrors(() => true, 'deterministic', {
		alphabets: ['a', 'b'],
		final_states: [0, 1],
		label: 'DFA',
		start_state: 0,
		states: [0, 1, 2],
		transitions: {
			0: [1, 2],
			1: [2, 1],
			2: 'loop',
		},
	});
	expect(generatedErrors.length).toBe(0);
});

it(`Should generate errors`, () => {
	const generatedErrors = generatePreNormalizationErrors(undefined as any, 'deterministic', {
		epsilon_transitions: {},
	} as any);
	expect(generatedErrors).toStrictEqual([
		`testLogic function is required in automaton`,
		'Automaton label is required',
		'Automaton transitions is required',
		'Automaton states is required',
		'Automaton alphabets is required',
		`Deterministic automaton can't contain epsilon transitions`,
		'Automaton start_state is required',
		'Automaton final_states is required',
		'Automaton states must be an array of length > 0',
		'Automaton alphabets must be an array of length > 0',
		'Automaton final_states must be an array of length > 0',
	]);

	const generatedErrors2 = generatePreNormalizationErrors(() => true, 'deterministic', {
		states: 5,
		alphabets: 5,
		final_states: 5,
		start_state: 0,
		label: 'DFA',
		transitions: {},
	} as any);
	expect(generatedErrors2).toStrictEqual([
		'Automaton alphabets must be an array',
		'Automaton states must be an array',
		'Automaton final_states must be an array',
		'Automaton states must be an array of length > 0',
		'Automaton alphabets must be an array of length > 0',
		'Automaton final_states must be an array of length > 0',
	]);
});
