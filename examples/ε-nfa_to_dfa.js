const { NonDeterministicFiniteAutomaton } = require('fauton');

const epsilonNfa = new NonDeterministicFiniteAutomaton((_, automatonTest) => automatonTest, {
	start_state: 0,
	alphabets: ['a', 'b'],
	final_states: [10],
	label: 'sample ε nfa',
	states: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	transitions: {
		2: [3],
		4: [null, 5],
		7: [8],
		8: [null, 9],
		9: [null, 10],
	},
	epsilon_transitions: {
		0: [1, 7],
		1: [2, 4],
		3: [6],
		5: [6],
		6: [1, 7],
	},
});

console.log(
	JSON.stringify(
		epsilonNfa.convertToDeterministicFiniteAutomaton({
			separator: '-',
		}),
		null,
		2
	)
);
