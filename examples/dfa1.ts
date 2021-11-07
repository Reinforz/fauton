import { IDfaTest } from '../types';

const dfaTest: IDfaTest = {
	testLogic(randomBinaryString) {
		return randomBinaryString.startsWith('01') && randomBinaryString.endsWith('10');
	},
	DFA: {
		label: 'DFA 1',
		description: 'A DFA that accepts the set of binary strings that start with 01 and end with 10.',
		start_state: '1',
		final_states: ['5'],
		transitions: {
			1: ['2', '3'],
			2: ['3', '4'],
			3: 'loop',
			4: ['5', '4'],
			5: ['6', '4'],
			6: ['6', '4'],
		},
	},
};

export default dfaTest;
