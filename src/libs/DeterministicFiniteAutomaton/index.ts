/* eslint-disable no-param-reassign */
import {
	GeneratedAutomatonOptions,
	IAutomatonTestLogicFn,
	IFiniteAutomaton,
	InputFiniteAutomaton,
	TMergeOperation,
	TransformedFiniteAutomaton,
} from '../../types';
import { FiniteAutomaton } from '../FiniteAutomaton';
import * as DeterministicFiniteAutomatonUtils from './utils';

export class DeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
		automaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'deterministic', automatonId);
	}

	#merge(
		finiteAutomaton: DeterministicFiniteAutomaton | undefined,
		mergeOperation: TMergeOperation,
		generatedAutomatonOptions?: GeneratedAutomatonOptions
	) {
		const { automaton, testLogic, automatonId } = DeterministicFiniteAutomatonUtils.merge(
			{
				automaton: this.automaton,
				automatonId: this.getAutomatonId(),
				testLogic: this.testLogic,
			},
			finiteAutomaton
				? {
						automaton: finiteAutomaton.automaton,
						automatonId: finiteAutomaton.getAutomatonId(),
						testLogic: finiteAutomaton.testLogic,
				  }
				: undefined,
			mergeOperation,
			generatedAutomatonOptions
		);
		return new DeterministicFiniteAutomaton(testLogic, automaton, automatonId);
	}

	AND(
		dfaModule: DeterministicFiniteAutomaton,
		generatedAutomatonOptions?: GeneratedAutomatonOptions
	) {
		return this.#merge(dfaModule, 'and', generatedAutomatonOptions);
	}

	NOT(generatedAutomatonOptions?: GeneratedAutomatonOptions) {
		return this.#merge(undefined, 'not', generatedAutomatonOptions);
	}

	OR(
		dfaModule: DeterministicFiniteAutomaton,
		generatedAutomatonOptions?: GeneratedAutomatonOptions
	) {
		return this.#merge(dfaModule, 'or', generatedAutomatonOptions);
	}

	// Used to figure out which state belongs to which group in groups
	generateStateGroupsRecord(stateGroups: string[][]) {
		return DeterministicFiniteAutomatonUtils.generateStateGroupsRecord(
			this.automaton.states,
			stateGroups
		);
	}

	generateEquivalenceStates(stateGroups: string[][]) {
		return DeterministicFiniteAutomatonUtils.generateEquivalenceStates(this.automaton, stateGroups);
	}

	minimize(
		minimizedDfaOptions?: Pick<
			Pick<IFiniteAutomaton, 'automaton'>['automaton'],
			'label' | 'description'
		>
	) {
		return new DeterministicFiniteAutomaton(
			this.testLogic,
			DeterministicFiniteAutomatonUtils.minimize(this.automaton, minimizedDfaOptions)
		);
	}
}

export { DeterministicFiniteAutomatonUtils };
