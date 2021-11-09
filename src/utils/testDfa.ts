import { TransformedFiniteAutomaton } from '../types';

export default function testDfa(finiteAutomaton: TransformedFiniteAutomaton, inputString: string) {
	let state = finiteAutomaton.start_state;
	for (let i = 0; i < inputString.length; i++) {
		const inputChar = inputString[i];
		const symbolStateRecord = finiteAutomaton.transitions[state];
		if (!symbolStateRecord[inputChar]) {
			break;
		}
		// ! this only supports deterministic, as we are only extracting the 1 state
		state = symbolStateRecord[inputChar][0];
	}
	return finiteAutomaton.final_states.includes(state);
}
