import shortid from 'shortid';
import { InputFiniteAutomaton, TransformedFiniteAutomaton } from '../types';

export default class FiniteAutomaton {
	testLogic: (inputString: string) => boolean;
	automaton: TransformedFiniteAutomaton;
	#automatonId: string;

	constructor(
		testLogic: (inputString: string) => boolean,
		finiteAutomaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		this.testLogic = testLogic;
		this.automaton = this.#normalize(finiteAutomaton);
		this.#automatonId = automatonId ?? shortid();
	}

	#normalize(finiteAutomaton: InputFiniteAutomaton) {
		finiteAutomaton.final_states = finiteAutomaton.final_states.map(
			(finalState) => (finiteAutomaton.append ?? '') + finalState.toString()
		);
		finiteAutomaton.start_state =
			(finiteAutomaton.append ?? '') + finiteAutomaton.start_state.toString();
		finiteAutomaton.states = finiteAutomaton.states.map(
			(state) => (finiteAutomaton.append ?? '') + state.toString()
		);
		Object.entries(finiteAutomaton.transitions).forEach(([transitionKey, transitionStates]) => {
			const transformedTransitionValues =
				typeof transitionStates !== 'string'
					? transitionStates.map(
							(transitionState) => (finiteAutomaton.append ?? '') + transitionState.toString()
					  )
					: (transitionStates as any);
			delete finiteAutomaton.transitions[transitionKey];
			finiteAutomaton.transitions[(finiteAutomaton.append ?? '') + transitionKey] =
				transformedTransitionValues;
		});

		return finiteAutomaton as TransformedFiniteAutomaton;
	}

	getAutomatonId() {
		return this.#automatonId;
	}
}
