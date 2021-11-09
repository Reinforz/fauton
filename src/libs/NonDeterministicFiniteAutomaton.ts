import { InputFiniteAutomaton } from '../types';
import { FiniteAutomaton } from './FiniteAutomaton';

export class NonDeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: (binaryString: string) => boolean,
		automaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'non-deterministic', automatonId);
	}
}
