const { DeterministicFiniteAutomaton, FiniteAutomataTest } = require('fauton');
const path = require('path');

const startsWithBC = new DeterministicFiniteAutomaton(
	(inputString) => inputString.startsWith('bc'),
	{
		alphabets: ['a', 'b', 'c'],
		description: 'Starts with bc',
		final_states: ['Q3'],
		label: 'starts_with_bc',
		start_state: 'Q0',
		states: ['Q0', 'Q1', 'Q2', 'Q3'],
		transitions: {
			Q0: ['Q2', 'Q1', 'Q2'],
			Q1: ['Q2', 'Q2', 'Q3'],
			Q2: 'loop',
			Q3: 'loop',
		},
	}
);

const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));
finiteAutomataTest.test([
	{
		automaton: startsWithBC,
		options: {
			type: 'generate',
			range: {
				maxLength: 10,
			},
		},
	},
]);
