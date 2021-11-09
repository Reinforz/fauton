import { FiniteAutomatonModule, InputFiniteAutomaton } from '../types';
import { FiniteAutomaton } from './FiniteAutomaton';

type IMergedDfaOptions = Partial<
	Pick<Pick<FiniteAutomatonModule, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;

type TMergeOperation = 'or' | 'and' | 'not';
export class DeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: (binaryString: string) => boolean,
		automaton: InputFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'deterministic', automatonId);
	}

	#generateMergedDfaData(
		dfaState: string,
		newStates: string[],
		newTransitions: FiniteAutomatonModule['automaton']['transitions'],
		newFinalStates: Set<string>,
		mergeOperation: TMergeOperation,
		dfaModule: DeterministicFiniteAutomaton | undefined,
		isComposite: boolean,
		separator: string
	) {
		this.automaton.states.forEach((currentDfaState) => {
			const newState = isComposite
				? `${dfaModule ? dfaState + separator : dfaState}${currentDfaState}`
				: currentDfaState;
			if (isComposite) {
				newStates.push(newState);
				const newStateForSymbolZero =
					(dfaModule ? dfaModule.automaton.transitions[dfaState][0].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][0].toString();
				const newStateForSymbolOne =
					(dfaModule ? dfaModule.automaton.transitions[dfaState][1].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][1].toString();
				newTransitions[newState] = [newStateForSymbolZero, newStateForSymbolOne];
				if (
					mergeOperation === 'or' &&
					((dfaModule ? dfaModule.automaton.final_states.includes(dfaState) : true) ||
						this.automaton.final_states.includes(currentDfaState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(dfaModule ? dfaModule.automaton.final_states.includes(dfaState) : true) &&
					this.automaton.final_states.includes(currentDfaState)
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'not' &&
					!this.automaton.final_states.includes(currentDfaState)
				) {
					newFinalStates.add(newState);
				}
			} else {
				if (
					mergeOperation === 'or' &&
					((dfaModule ? dfaModule.automaton.final_states.includes(newState) : true) ||
						this.automaton.final_states.includes(newState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(dfaModule ? dfaModule.automaton.final_states.includes(newState) : true) &&
					this.automaton.final_states.includes(newState)
				) {
					newFinalStates.add(newState);
				} else if (mergeOperation === 'not' && !this.automaton.final_states.includes(newState)) {
					newFinalStates.add(newState);
				}
			}
		});
	}

	#merge(
		dfaModule: DeterministicFiniteAutomaton | undefined,
		mergeOperation: TMergeOperation,
		mergedDfaOptions?: IMergedDfaOptions
	) {
		const { separator = '.', label, description } = mergedDfaOptions ?? ({} as IMergedDfaOptions);
		const newStates: string[] = [];
		const newTransitions: FiniteAutomatonModule['automaton']['transitions'] = {};
		// If we have two different dfa's we are in composite mode
		const isComposite = (dfaModule ? dfaModule.getAutomatonId() : '') !== this.getAutomatonId();
		const newDfaId =
			isComposite && dfaModule
				? dfaModule.getAutomatonId() + separator + this.getAutomatonId()
				: this.getAutomatonId();

		// Only create a new state if its not composite
		const newStartState =
			(isComposite && dfaModule ? dfaModule.automaton.start_state.toString() + separator : '') +
			this.automaton.start_state.toString();
		const newFinalStates: Set<string> = new Set();

		if (dfaModule) {
			dfaModule.automaton.states.forEach((dfaState) => {
				this.#generateMergedDfaData(
					dfaState,
					newStates,
					newTransitions,
					newFinalStates,
					mergeOperation,
					dfaModule,
					isComposite,
					separator
				);
			});
		} else {
			this.#generateMergedDfaData(
				'',
				newStates,
				newTransitions,
				newFinalStates,
				mergeOperation,
				dfaModule,
				isComposite,
				separator
			);
		}

		if (!isComposite) {
		}

		return new DeterministicFiniteAutomaton(
			(binaryString) => {
				if (mergeOperation === 'or') {
					return (
						(dfaModule ? dfaModule.testLogic(binaryString) : true) || this.testLogic(binaryString)
					);
				} else if (mergeOperation === 'and') {
					return (
						(dfaModule ? dfaModule.testLogic(binaryString) : true) && this.testLogic(binaryString)
					);
				} else {
					return !this.testLogic(binaryString);
				}
			},
			{
				final_states: Array.from(newFinalStates),
				label:
					label ?? `${dfaModule ? dfaModule.automaton.label + ' - ' : ''}${this.automaton.label}`,
				description:
					description ??
					mergeOperation.toUpperCase() +
						'(' +
						`${dfaModule ? dfaModule.automaton.description + ', ' : ''}${
							this.automaton.description
						}` +
						')',
				start_state: isComposite ? newStartState : this.automaton.start_state,
				states: isComposite ? newStates : this.automaton.states,
				transitions: isComposite ? newTransitions : this.automaton.transitions,
			},
			isComposite ? newDfaId : this.getAutomatonId()
		);
	}

	AND(dfaModule: DeterministicFiniteAutomaton, mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'and', mergedDfaOptions);
	}

	NOT(mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(undefined, 'not', mergedDfaOptions);
	}

	OR(dfaModule: DeterministicFiniteAutomaton, mergedDfaOptions: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'or', mergedDfaOptions);
	}
}
