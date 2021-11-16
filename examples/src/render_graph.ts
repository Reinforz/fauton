import { NonDeterministicFiniteAutomaton, Render } from 'fauton';
import path from 'path';

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
			A: ['B', 'C', 'B'],
			B: ['A', 'C'],
			C: ['A', null, 'C'],
		},
		epsilon_transitions: {
			A: ['B'],
			B: ['C'],
		},
	}
);

const { graph } = randomEpsilonNFA.generateGraphFromString('abbc');
console.log(JSON.stringify(graph, null, 2));
Render.graphToHtml(graph, path.join(__dirname, 'index.html'));
