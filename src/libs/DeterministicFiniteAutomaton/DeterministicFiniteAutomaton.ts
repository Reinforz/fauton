/* eslint-disable no-param-reassign */
import {
	IAutomatonTestLogicFn,
	IFiniteAutomaton,
	InputFiniteAutomaton,
	TransformedFiniteAutomaton,
} from '../../types';
import { FiniteAutomaton } from '../FiniteAutomaton';

type IMergedDfaOptions = Partial<
	Pick<Pick<IFiniteAutomaton, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;

type TMergeOperation = 'or' | 'and' | 'not';
export class DeterministicFiniteAutomaton extends FiniteAutomaton {
	constructor(
		testLogic: IAutomatonTestLogicFn,
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
		inputAutomaton: DeterministicFiniteAutomaton | undefined,
		isComposite: boolean,
		separator: string
	) {
		const currentAutomatonFinalStates = new Set(this.automaton.final_states);
		const inputAutomatonFinalStates = new Set(
			inputAutomaton ? inputAutomaton.automaton.final_states : []
		);

		this.automaton.states.forEach((currentDfaState) => {
			const newState = isComposite ? `${currentDfaState}${separator}${state}` : currentDfaState;
			if (isComposite) {
				newStates.push(newState);
				newTransitions[newState] = {};
				this.automaton.alphabets.forEach((automatonAlphabet) => {
					newTransitions[newState][automatonAlphabet] = [
						this.automaton.transitions[currentDfaState][automatonAlphabet] +
							separator +
							(inputAutomaton
								? inputAutomaton.automaton.transitions[state][automatonAlphabet]
								: ''),
					];
				});
				if (
					mergeOperation === 'or' &&
					((inputAutomaton ? inputAutomatonFinalStates.has(state) : true) ||
						currentAutomatonFinalStates.has(currentDfaState))
				) {
					newFinalStates.add(newState);
				} else if (
					mergeOperation === 'and' &&
					(inputAutomaton ? inputAutomatonFinalStates.has(state) : true) &&
					currentAutomatonFinalStates.has(currentDfaState)
				) {
					newFinalStates.add(newState);
				} else if (mergeOperation === 'not' && !currentAutomatonFinalStates.has(currentDfaState)) {
					newFinalStates.add(newState);
				}
			} else if (
				mergeOperation === 'or' &&
				((inputAutomaton ? inputAutomatonFinalStates.has(newState) : true) ||
					currentAutomatonFinalStates.has(newState))
			) {
				newFinalStates.add(newState);
			} else if (
				mergeOperation === 'and' &&
				(inputAutomaton ? inputAutomatonFinalStates.has(newState) : true) &&
				currentAutomatonFinalStates.has(newState)
			) {
				newFinalStates.add(newState);
			} else if (mergeOperation === 'not' && !currentAutomatonFinalStates.has(newState)) {
				newFinalStates.add(newState);
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
		const isComposite = Boolean(
			finiteAutomaton &&
				(finiteAutomaton ? finiteAutomaton.getAutomatonId() : '') !== this.getAutomatonId()
		);

		// If we are in composite mode, we need to generate a new id for the new dfa, by merging the ids of two input dfs separated by a separator
		const newDfaId =
			isComposite && finiteAutomaton
				? this.getAutomatonId() + separator + finiteAutomaton.getAutomatonId()
				: this.getAutomatonId();

		// Only create a new state if its not composite
		const newStartState =
			isComposite && finiteAutomaton
				? this.automaton.start_state + separator + finiteAutomaton.automaton.start_state
				: this.automaton.start_state;
		const newFinalStates: Set<string> = new Set();

		// If we have a input dfa, for operations like AND and OR
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
		}
		// If we dont have an input dfa, for operations like NOT, which acts on the dfa itself
		else {
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
		return new DeterministicFiniteAutomaton(
			(inputString, automatonTestResult) => {
				if (mergeOperation === 'or') {
					return (
						finiteAutomaton!.testLogic(inputString, automatonTestResult) ||
						this.testLogic(inputString, automatonTestResult)
					);
				}
				if (mergeOperation === 'and') {
					return (
						finiteAutomaton!.testLogic(inputString, automatonTestResult) &&
						this.testLogic(inputString, automatonTestResult)
					);
				}
				return !this.testLogic(inputString, automatonTestResult);
			},
			{
				final_states: Array.from(newFinalStates),
				label:
					label ??
					`${mergeOperation}(` +
						`${this.automaton.label}${mergeOperation !== 'not' ? ', ' : ''}${
							finiteAutomaton ? finiteAutomaton.automaton.label : ''
						}` +
						`)`,
				description:
					description ??
					`${mergeOperation.toUpperCase()}(` +
						`${this.automaton.description}${mergeOperation !== 'not' ? ', ' : ''}${
							finiteAutomaton ? finiteAutomaton.automaton.description : ''
						}` +
						`)`,
				start_state: isComposite ? newStartState : this.automaton.start_state,
				states: isComposite ? newStates : JSON.parse(JSON.stringify(this.automaton.states)),
				transitions: (isComposite
					? newTransitions
					: JSON.parse(
							JSON.stringify(this.automaton.transitions)
					  )) as TransformedFiniteAutomaton['transitions'],
				alphabets: this.automaton.alphabets,
				epsilon_transitions: null,
			},
			isComposite ? newDfaId : this.getAutomatonId()
		);
	}

	AND(dfaModule: DeterministicFiniteAutomaton, mergedDfaOptions?: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'and', mergedDfaOptions);
	}

	NOT(mergedDfaOptions?: IMergedDfaOptions) {
		return this.#merge(undefined, 'not', mergedDfaOptions);
	}

	OR(dfaModule: DeterministicFiniteAutomaton, mergedDfaOptions?: IMergedDfaOptions) {
		return this.#merge(dfaModule, 'or', mergedDfaOptions);
	}

	// Used to figure out which state belongs to which group in groups
	generateStateGroupsRecord(stateGroups: string[][]) {
		const stateGroupsRecord: Record<string, number> = {};
		const allStatesSet: Set<string> = new Set(this.automaton.states);
		stateGroups.forEach((stateGroup, stateGroupIndex) => {
			// State group would contain combinations of states
			stateGroup.forEach((state) => {
				// Since states could be joined by , or other separators
				// We should check whether the character actually is a state
				if (allStatesSet.has(state)) {
					stateGroupsRecord[state] = stateGroupIndex;
				}
			});
		});
		return stateGroupsRecord;
	}

	generateEquivalenceStates(stateGroups: string[][]) {
		const stateGroupsRecord = this.generateStateGroupsRecord(stateGroups);
		const stateGroupsSymbolsRecord: Record<string, string[]> = {};
		// Segregating state groups based on its length
		const singleStateGroups: string[][] = [];
		const compositeStateGroups: string[][] = [];
		stateGroups.forEach((stateGroup) => {
			if (stateGroup.length > 1) {
				compositeStateGroups.push(stateGroup);
			} else {
				singleStateGroups.push(stateGroup);
			}
		});
		// Looping through only composite state groups as only they can be broken down further
		compositeStateGroups.forEach((compositeStateGroup) => {
			compositeStateGroup.forEach((state) => {
				// Each combination of state group (for each symbol) we will be the key
				let stateGroup = '';
				this.automaton.alphabets.forEach((symbol) => {
					stateGroup += stateGroupsRecord[this.automaton.transitions[state][symbol].toString()];
				});
				if (!stateGroupsSymbolsRecord[stateGroup]) {
					stateGroupsSymbolsRecord[stateGroup] = [state];
				} else {
					stateGroupsSymbolsRecord[stateGroup].push(state);
				}
			});
		});
		// Attaching the single state groups as they were not present in the record
		return Object.values(stateGroupsSymbolsRecord).concat(singleStateGroups);
	}

	static checkEquivalenceBetweenStatesGroups(statesGroups: [string[][], string[][]]) {
		const [statesGroupsOne, statesGroupsTwo] = statesGroups;
		if (statesGroupsOne.length !== statesGroupsTwo.length) return false;

		let isEquivalent = true;
		const stateGroupsSet: Set<string> = new Set();
		statesGroupsOne.forEach((statesGroup) => {
			stateGroupsSet.add(statesGroup.join(''));
		});
		for (let index = 0; index < statesGroupsTwo.length; index += 1) {
			const statesGroup = statesGroupsTwo[index];
			if (!stateGroupsSet.has(statesGroup.join(''))) {
				isEquivalent = false;
				break;
			}
		}

		return isEquivalent;
	}

	minimize(
		minimizedDfaOptions?: Pick<
			Pick<IFiniteAutomaton, 'automaton'>['automaton'],
			'label' | 'description'
		>
	) {
		const finalStatesSet: Set<string> = new Set(this.automaton.final_states);
		const nonFinalStates: string[] = [];
		this.automaton.states.forEach((state) => {
			if (!finalStatesSet.has(state)) {
				nonFinalStates.push(state);
			}
		});
		const finalStateString = this.automaton.final_states.join('');
		let currentEquivalentStatesGroups: string[][] = [nonFinalStates, this.automaton.final_states];
		let previousEquivalentStatesGroups: string[][] = [];
		let shouldStop = false;
		while (!shouldStop) {
			previousEquivalentStatesGroups = currentEquivalentStatesGroups;
			currentEquivalentStatesGroups = this.generateEquivalenceStates(currentEquivalentStatesGroups);
			shouldStop = DeterministicFiniteAutomaton.checkEquivalenceBetweenStatesGroups([
				currentEquivalentStatesGroups,
				previousEquivalentStatesGroups,
			]);
		}

		const stateGroupsRecord = this.generateStateGroupsRecord(currentEquivalentStatesGroups);
		const newStateState = currentEquivalentStatesGroups.find((stateGroup) =>
			stateGroup.includes(this.automaton.start_state)
		);

		const newTransitions: IFiniteAutomaton['automaton']['transitions'] = {};
		currentEquivalentStatesGroups.forEach((currentEquivalentStatesGroup) => {
			// ["AC"] => A, since in a group they will have the same transitions for a symbol
			const [firstState] = currentEquivalentStatesGroup;
			const newState = currentEquivalentStatesGroup.join('');
			newTransitions[newState] = {};
			this.automaton.alphabets.forEach((symbol) => {
				newTransitions[newState][symbol] = [
					currentEquivalentStatesGroups[
						stateGroupsRecord[this.automaton.transitions[firstState][symbol][0]]
					].join(''),
				];
			});
		});

		return new DeterministicFiniteAutomaton(this.testLogic, {
			label: minimizedDfaOptions?.label ?? this.automaton.label,
			alphabets: this.automaton.alphabets,
			description: minimizedDfaOptions?.description ?? this.automaton.description,
			final_states: [finalStateString],
			start_state: newStateState?.join('') ?? this.automaton.start_state,
			states: currentEquivalentStatesGroups.map((currentEquivalentStatesGroup) =>
				currentEquivalentStatesGroup.join('')
			),
			transitions: newTransitions,
			epsilon_transitions: null,
		});
	}
}
