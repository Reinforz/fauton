const { NonDeterministicFiniteAutomaton } = require('fauton');

const nfa = new NonDeterministicFiniteAutomaton((_, automatonTest) => automatonTest, {
	start_state: 'q0',
	alphabets: ['a', 'b'],
	final_states: ['q1'],
	label: 'sample nfa',
	states: ['q0', 'q1', 'q2'],
	transitions: {
		q0: [['q2', 'q1']],
		q2: [['q2', 'q1'], 'q2'],
	},
});

console.log(JSON.stringify(nfa.convertToDeterministicFiniteAutomaton(), null, 2));
