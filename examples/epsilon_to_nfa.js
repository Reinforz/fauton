const { NonDeterministicFiniteAutomaton } = require('fauton');

const randomEpsilonNFA = new NonDeterministicFiniteAutomaton(
	(inputString) => inputString.startsWith('ab'),
	{
		alphabets: ['a', 'b', 'c'],
		description: 'Starts with ab',
		final_states: ['C'],
		label: 'random_epsilon_nfa',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['B', null, 'B'],
			B: [null, 'C'],
			C: [null, null, 'C'],
		},
		epsilon_transitions: {
			A: ['B'],
			B: ['C'],
		},
	}
);

console.log(randomEpsilonNFA.automaton.transitions);
