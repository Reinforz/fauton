import { IBinaryDFA } from '../types';

export default function testDfa(DFA: IBinaryDFA, randomBinaryString: string) {
	let state = DFA.start_state;
	for (let i = 0; i < randomBinaryString.length; i++) {
		const binaryChar = randomBinaryString[i];
		const currentState = DFA.transitions[state];
		// If all the
		const isTrap = currentState === 'loop';
		if (isTrap === true) {
			break;
		} else {
			if (binaryChar === '0') {
				state = currentState[0];
			} else if (binaryChar === '1') {
				state = currentState[1];
			}
		}
	}
	return DFA.final_states.includes(state);
}
