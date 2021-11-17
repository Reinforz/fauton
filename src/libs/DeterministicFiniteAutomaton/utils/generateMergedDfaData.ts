/* eslint-disable no-param-reassign */
import { IFiniteAutomaton, TMergeOperation, TransformedFiniteAutomaton } from '../../../types';

export function generateMergedDfaData(
	sourceAutomaton: Pick<
		TransformedFiniteAutomaton,
		'final_states' | 'states' | 'transitions' | 'alphabets'
	>,
	state: string,
	newStates: string[],
	newTransitions: IFiniteAutomaton['automaton']['transitions'],
	newFinalStates: Set<string>,
	mergeOperation: TMergeOperation,
	inputAutomaton: IFiniteAutomaton | undefined,
	isComposite: boolean,
	separator: string
) {
	const currentAutomatonFinalStates = new Set(sourceAutomaton.final_states);
	const inputAutomatonFinalStates = new Set(
		inputAutomaton ? inputAutomaton.automaton.final_states : []
	);

	sourceAutomaton.states.forEach((currentDfaState) => {
		const newState = isComposite ? `${currentDfaState}${separator}${state}` : currentDfaState;
		if (isComposite) {
			newStates.push(newState);
			newTransitions[newState] = {};
			sourceAutomaton.alphabets.forEach((automatonAlphabet) => {
				newTransitions[newState][automatonAlphabet] = [
					sourceAutomaton.transitions[currentDfaState][automatonAlphabet] +
						separator +
						(inputAutomaton ? inputAutomaton.automaton.transitions[state][automatonAlphabet] : ''),
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
