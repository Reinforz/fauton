import { IBinaryDFA } from '../types';

export default function testDfa(DFA: IBinaryDFA, randomBinaryString: string) {
	let state = DFA.start_state;
	for (let i = 0; i < randomBinaryString.length; i++) {
		const binaryChar = randomBinaryString[i] as '0' | '1';
		const currentState = DFA.transitions[state];
		if (currentState.isTrap === true) {
			break;
		} else {
			state = currentState[binaryChar];
		}
	}
	return DFA.final_states.includes(state);
}
