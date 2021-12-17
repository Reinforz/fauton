import { AutomataTest, DeterministicFiniteAutomaton, FiniteAutomatonUtils } from 'fauton';
import path from 'path';

const dfa = new DeterministicFiniteAutomaton(() => true, {
	states: [0, 1, 2, 3, 4, 5, 6, 7],
	alphabets: ['0', '1'],
	final_states: [2],
	start_state: 0,
	label: 'dfa',
	transitions: {
		0: [1, 5],
		1: [6, 2],
		2: [0, 2],
		3: [2, 6],
		4: [7, 5],
		5: [2, 6],
		6: [6, 4],
		7: [6, 2],
	},
});

const minimized_dfa = dfa.minimize();

minimized_dfa.testLogic = (inputString) => {
	return FiniteAutomatonUtils.generateGraphFromString(dfa.automaton, inputString)
		.automatonTestResult;
};

const finiteAutomataTest = new AutomataTest(path.join(__dirname, 'logs'));

finiteAutomataTest.test([
	{
		automatonInfo: minimized_dfa,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
