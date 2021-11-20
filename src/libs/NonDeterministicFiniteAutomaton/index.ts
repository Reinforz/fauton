import {
	GeneratedAutomatonOptions,
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
} from '../../types';
import { DeterministicFiniteAutomaton } from '../DeterministicFiniteAutomaton';
import { FiniteAutomaton } from '../FiniteAutomaton';
import * as NonDeterministicFiniteAutomatonUtils from './utils';

export class NonDeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
		automaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'non-deterministic', automatonId);
		if (this.automaton.epsilon_transitions) {
			this.convertToRegularNfa();
		}
	}

	convertToRegularNfa() {
		NonDeterministicFiniteAutomatonUtils.convertToRegularNfa(this.automaton);
	}

	/**
	 * Generates a set of states reachable from input state, using depth-first-search algorithm
	 * @param state state from where to start searching for epsilon closure states
	 * @returns A set of states reachable from the input state on all epsilon transitions
	 */
	epsilonClosureOfState(state: string) {
		return NonDeterministicFiniteAutomatonUtils.epsilonClosureOfState(
			this.automaton.epsilon_transitions,
			state
		);
	}

	// ε-closure(Move_NFA(states, letter))
	moveAndEpsilonClosureStateSet(states: string[], symbol: string) {
		return NonDeterministicFiniteAutomatonUtils.moveAndEpsilonClosureStateSet(
			this.automaton.transitions,
			this.automaton.epsilon_transitions,
			states,
			symbol
		);
	}

	convertToDeterministicFiniteAutomaton(dfaOptions?: GeneratedAutomatonOptions) {
		return new DeterministicFiniteAutomaton(
			this.testLogic,
			NonDeterministicFiniteAutomatonUtils.convertToDeterministicFiniteAutomaton(
				this.automaton,
				dfaOptions
			),
			undefined,
			{
				skipNormalization: false,
				skipValidation: false,
			}
		);
	}
}

export { NonDeterministicFiniteAutomatonUtils };
