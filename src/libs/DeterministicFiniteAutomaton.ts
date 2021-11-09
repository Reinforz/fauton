import { IFiniteAutomaton, InputFiniteAutomaton, TransformedFiniteAutomaton } from '../types';
import { FiniteAutomaton } from './FiniteAutomaton';

type IMergedDfaOptions = Partial<
	Pick<Pick<IFiniteAutomaton, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;

type TMergeOperation = 'or' | 'and' | 'not';
export class DeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: (inputString: string) => boolean,
		automaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonId?: string
	) {
		super(testLogic, automaton, 'deterministic', automatonId);
	}

	#generateMergedDfaData(
		state: string,
		newStates: string[],
		newTransitions: IFiniteAutomaton['automaton']['transitions'],
		newFinalStates: Set<string>,
		mergeOperation: TMergeOperation,
		dfaModule: DeterministicFiniteAutomaton | undefined,
		isComposite: boolean,
		separator: string
	) {
		this.automaton.states.forEach((currentDfaState) => {
			const newState = isComposite
				? `${dfaModule ? state + separator : state}${currentDfaState}`
				: currentDfaState;
			if (isComposite) {
				newStates.push(newState);
				const newStateForSymbolZero =
					(dfaModule ? dfaModule.automaton.transitions[state]['0'].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][0].toString();
				const newStateForSymbolOne =
					(dfaModule ? dfaModule.automaton.transitions[state][1].toString() + separator : '') +
					this.automaton.transitions[currentDfaState][1].toString();
				newTransitions[newState] = [newStateForSymbolZero, newStateForSymbolOne];
				if (
					mergeOperation === 'or' &&
					((dfaModule ? dfaModule.automaton.final_states.includes(state) : true) ||
						this.automaton.final_states.includes(currentDfaState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(dfaModule ? dfaModule.automaton.final_states.includes(state) : true) &&
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
		finiteAutomaton: DeterministicFiniteAutomaton | undefined,
		mergeOperation: TMergeOperation,
		mergedDfaOptions?: IMergedDfaOptions
	) {
		const { separator = '.', label, description } = mergedDfaOptions ?? ({} as IMergedDfaOptions);
		const newStates: string[] = [];
		const newTransitions: IFiniteAutomaton['automaton']['transitions'] = {};
		// If we have two different dfa's we are in composite mode
		const isComposite =
			(finiteAutomaton ? finiteAutomaton.getAutomatonId() : '') !== this.getAutomatonId();
		const newDfaId =
			isComposite && finiteAutomaton
				? finiteAutomaton.getAutomatonId() + separator + this.getAutomatonId()
				: this.getAutomatonId();

		// Only create a new state if its not composite
		const newStartState =
			(isComposite && finiteAutomaton
				? finiteAutomaton.automaton.start_state.toString() + separator
				: '') + this.automaton.start_state.toString();
		const newFinalStates: Set<string> = new Set();

		if (finiteAutomaton) {
			finiteAutomaton.automaton.states.forEach((state) => {
				this.#generateMergedDfaData(
					state,
					newStates,
					newTransitions,
					newFinalStates,
					mergeOperation,
					finiteAutomaton,
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
				finiteAutomaton,
				isComposite,
				separator
			);
		}

		if (!isComposite) {
		}

		return new DeterministicFiniteAutomaton(
			(inputString) => {
				if (mergeOperation === 'or') {
					return (
						(finiteAutomaton ? finiteAutomaton.testLogic(inputString) : true) ||
						this.testLogic(inputString)
					);
				} else if (mergeOperation === 'and') {
					return (
						(finiteAutomaton ? finiteAutomaton.testLogic(inputString) : true) &&
						this.testLogic(inputString)
					);
				} else {
					return !this.testLogic(inputString);
				}
			},
			{
				final_states: Array.from(newFinalStates),
				label:
					label ??
					`${finiteAutomaton ? finiteAutomaton.automaton.label + ' - ' : ''}${
						this.automaton.label
					}`,
				description:
					description ??
					mergeOperation.toUpperCase() +
						'(' +
						`${finiteAutomaton ? finiteAutomaton.automaton.description + ', ' : ''}${
							this.automaton.description
						}` +
						')',
				start_state: isComposite ? newStartState : this.automaton.start_state,
				states: isComposite ? newStates : this.automaton.states,
				transitions: (isComposite
					? newTransitions
					: this.automaton.transitions) as TransformedFiniteAutomaton['transitions'],
				alphabets:
					isComposite && finiteAutomaton
						? this.automaton.alphabets.concat(finiteAutomaton.automaton.alphabets)
						: this.automaton.alphabets,
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
