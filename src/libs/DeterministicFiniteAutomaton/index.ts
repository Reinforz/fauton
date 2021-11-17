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

	generateMergedDfaData(
		state: string,
		newStates: string[],
		newTransitions: IFiniteAutomaton['automaton']['transitions'],
		newFinalStates: Set<string>,
		mergeOperation: TMergeOperation,
		inputAutomaton: DeterministicFiniteAutomaton | undefined,
		isComposite: boolean,
		separator: string
	) {
		return DeterministicFiniteAutomatonUtils.generateMergedDfaData(
			this.automaton,
			state,
			newStates,
			newTransitions,
			newFinalStates,
			mergeOperation,
			inputAutomaton,
			isComposite,
			separator
		);
	}

	#merge(
		finiteAutomaton: DeterministicFiniteAutomaton | undefined,
		mergeOperation: TMergeOperation,
		generatedAutomatonOptions?: GeneratedAutomatonOptions
	) {
		return DeterministicFiniteAutomatonUtils.merge(
			this.getAutomatonId(),
			this,
			finiteAutomaton,
			mergeOperation,
			generatedAutomatonOptions
		);
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
		return DeterministicFiniteAutomatonUtils.generateStateGroupsRecord(this.automaton, stateGroups);
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
		return DeterministicFiniteAutomatonUtils.minimize(
			this.testLogic,
			this.automaton,
			minimizedDfaOptions
		);
	}
}

export { DeterministicFiniteAutomatonUtils };
