import { DeterministicFiniteAutomaton } from '../DeterministicFiniteAutomaton';
import { FiniteAutomaton } from '../FiniteAutomaton';
import {
	GeneratedAutomatonOptions,
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	SkipOptions,
} from '../types';
import { convertToDeterministicFiniteAutomaton } from './convertToDeterministicFiniteAutomaton';
import { convertToRegularNfa } from './convertToRegularNfa';
import { epsilonClosureOfState } from './epsilonClosureOfState';
import { moveAndEpsilonClosureStateSet } from './moveAndEpsilonClosureStateSet';

export {
	convertToDeterministicFiniteAutomaton,
	convertToRegularNfa,
	epsilonClosureOfState,
	moveAndEpsilonClosureStateSet,
};

export class NonDeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
		automaton: InputFiniteAutomaton,
		automatonId?: string,
		skipOptions?: Partial<SkipOptions>
	) {
		super(
			testLogic,
			automaton,
			automaton.epsilon_transitions ? 'epsilon' : 'non-deterministic',
			automatonId,
			skipOptions
		);
		if (this.automaton.epsilon_transitions) {
			this.convertToRegularNfa();
		}
	}

	convertToRegularNfa() {
		convertToRegularNfa(this.automaton);
	}

	/**
	 * Generates a set of states reachable from input state, using depth-first-search algorithm
	 * @param state state from where to start searching for epsilon closure states
	 * @returns A set of states reachable from the input state on all epsilon transitions
	 */
	epsilonClosureOfState(state: string) {
		return epsilonClosureOfState(this.automaton.epsilon_transitions, state);
	}

	// ε-closure(Move_NFA(states, letter))
	moveAndEpsilonClosureStateSet(states: string[], symbol: string) {
		return moveAndEpsilonClosureStateSet(
			this.automaton.transitions,
			this.automaton.epsilon_transitions,
			states,
			symbol
		);
	}

	convertToDeterministicFiniteAutomaton(dfaOptions?: GeneratedAutomatonOptions) {
		return new DeterministicFiniteAutomaton(
			this.testLogic,
			convertToDeterministicFiniteAutomaton(this.automaton, dfaOptions),
			undefined,
			{
				skipCharacterRangesExpansion: true,
			}
		);
	}
}
