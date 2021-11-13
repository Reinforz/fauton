// import the class from the library
const { DeterministicFiniteAutomaton, FiniteAutomataTest } = require('fauton');
const startsWithBC = new DeterministicFiniteAutomaton(
	// Callback that will be passed each of the input string to test whether its should be accepted by the dfa or not
	(inputString) => inputString.startsWith('bc'),
	{
		// Required: The alphabets dfa accepts
		alphabets: ['a', 'b', 'c'],
		// Optional: A description of what the dfa does
		description: 'Starts with bc',
		// Required: An array of final states of the dfa
		final_states: ['Q3'],
		// Required: Label of the dfa. Convention is to use snake_case words
		label: 'starts_with_bc',
		// Required: Start state of the dfa
		start_state: 'Q0',
		// Required: An array of states the dfa accepts
		states: ['Q0', 'Q1', 'Q2', 'Q3'],
		// Required: A object of transition
		// Each key represents the state
		// The value is an array of strings, which should be equal to the length of the alphabets
		// Here if we are in state 'Q1' and we encounter symbol 'a', we move to the state 'Q2'
		transitions: {
			Q0: ['Q2', 'Q1', 'Q2'],
			Q1: ['Q2', 'Q2', 'Q3'],
			// this 'loop' is the same as ['Q2', 'Q2', 'Q2']
			// For automaton with bigger alphabets it might be difficult to write that out so its added as a convenience
			Q2: 'loop',
			Q3: 'loop',
		},
	}
);

// The constructor takes only one argument, the directory where the all the artifact files will be generated, if its not present, it will be created
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

// Call the test method to test out the automaton
// We will learn more about the array thats being passed later
finiteAutomataTest.test([
	{
		// The automaton to test
		automaton: startsWithBC,
		// A configuration object that is used to feed input strings to the automaton
		options: {
			type: 'generate',
			range: {
				maxLength: 10,
			},
		},
	},
]);
