import { AutomataTest, DeterministicFiniteAutomaton } from 'fauton';
import path from 'path';

const DivisibleBy3 = new DeterministicFiniteAutomaton(
	(inputString) => parseInt(inputString, 2) % 3 === 0,
	{
		alphabets: ['0', '1'],
		final_states: ['A'],
		label: 'divisible_by_3',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['A', 'B'],
			B: ['C', 'A'],
			C: ['B', 'C'],
		},
		description: 'Dfa to accept strings divisible by 3',
	}
);

const DivisibleBy2 = new DeterministicFiniteAutomaton(
	(inputString) => parseInt(inputString, 2) % 2 === 0,
	{
		alphabets: ['0', '1'],
		final_states: ['X'],
		label: 'divisible_by_2',
		start_state: 'X',
		states: ['X', 'Y'],
		transitions: {
			X: ['X', 'Y'],
			Y: ['X', 'Y'],
		},
		description: 'Dfa to accept strings divisible by 2',
	}
);

const DivisibleBy2Or3 = DivisibleBy2.OR(DivisibleBy3);
const NotDivisibleBy2And3 = DivisibleBy2.AND(DivisibleBy3).NOT();

const DivisibleBy3Or2ButNotByBoth = DivisibleBy2Or3.AND(NotDivisibleBy2And3);

const finiteAutomataTest = new AutomataTest(path.resolve(__dirname, 'logs'));
finiteAutomataTest.test([
	{
		automatonInfo: DivisibleBy3Or2ButNotByBoth,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);

console.log(DivisibleBy3Or2ButNotByBoth.automaton.transitions);
console.log(DivisibleBy3Or2ButNotByBoth.automaton.start_state);
console.log(DivisibleBy3Or2ButNotByBoth.automaton.final_states);
