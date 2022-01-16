/* eslint-disable no-param-reassign */

import { FiniteAutomaton } from '../FiniteAutomaton';
import {
	GeneratedAutomatonOptions,
	IAutomatonTestLogicFn,
	IFiniteAutomaton,
	InputFiniteAutomaton,
	SkipOptions,
	TMergeOperation,
	TransformedFiniteAutomaton,
} from '../types';
import { checkEquivalenceBetweenStatesGroups } from './checkEquivalenceBetweenStatesGroups';
import { generateEquivalenceStates } from './generateEquivalenceStates';
import { generateStateGroupsRecord } from './generateStateGroupsRecord';
import { merge } from './merge';
import { minimize } from './minimize';

export {
	generateEquivalenceStates,
	generateStateGroupsRecord,
	merge,
	minimize,
	checkEquivalenceBetweenStatesGroups,
};

export class DeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
		automaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonId?: string,
		skipOptions?: Partial<SkipOptions>
	) {
		super(testLogic, automaton, 'deterministic', automatonId, skipOptions);
	}

	#merge(
		finiteAutomaton: DeterministicFiniteAutomaton | undefined,
		mergeOperation: TMergeOperation,
		generatedAutomatonOptions?: GeneratedAutomatonOptions
	) {
		const { automaton, testLogic, automatonId } = merge(
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
		return new DeterministicFiniteAutomaton(testLogic, automaton, automatonId, {
			skipNormalization: true,
			skipValidation: true,
		});
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
		return generateStateGroupsRecord(this.automaton.states, stateGroups);
	}

	generateEquivalenceStates(stateGroups: string[][]) {
		return generateEquivalenceStates(this.automaton, stateGroups);
	}

	minimize(
		minimizedDfaOptions?: Pick<
			Pick<IFiniteAutomaton, 'automaton'>['automaton'],
			'label' | 'description'
		>
	) {
		return new DeterministicFiniteAutomaton(
			this.testLogic,
			minimize(this.automaton, minimizedDfaOptions),
			undefined,
			{
				skipCharacterRangesExpansion: true,
			}
		);
	}
}
