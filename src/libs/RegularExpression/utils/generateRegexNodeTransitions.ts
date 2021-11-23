import { IFiniteAutomaton } from '../../../types';

export function generateTransitionsForKleene(stateBoundaries: [number, number]) {
	const startIndex = stateBoundaries[0] - 1;
	const endIndex = stateBoundaries[1] + 1;

	const epsilonTransitionsRecord: IFiniteAutomaton['automaton']['epsilon_transitions'] = {
		[startIndex]: [`${stateBoundaries[0]}`, `${endIndex}`],
		[stateBoundaries[1]]: [`${stateBoundaries[0]}`, `${endIndex}`],
	};

	return {
		stateBoundaries: [startIndex, endIndex] as [number, number],
		epsilonTransitionsRecord,
	};
}

export function generateTransitionsForPlus(stateBoundaries: [number, number]) {
	const startIndex = stateBoundaries[0] - 1;
	const endIndex = stateBoundaries[1] + 1;

	const epsilonTransitionsRecord: IFiniteAutomaton['automaton']['epsilon_transitions'] = {
		[startIndex]: [`${stateBoundaries[0]}`],
		[stateBoundaries[1]]: [`${stateBoundaries[0]}`, `${endIndex}`],
	};

	return {
		stateBoundaries: [startIndex, endIndex] as [number, number],
		epsilonTransitionsRecord,
	};
}

export function generateTransitionsForSymbol(startState: number, symbol: string) {
	const transitionsRecord: IFiniteAutomaton['automaton']['transitions'] = {
		[startState]: {
			[symbol]: [`${startState + 1}`],
		},
	};
	return {
		stateBoundaries: [startState, startState + 1] as [number, number],
		transitionsRecord,
	};
}

export function generateTransitionsForConcat(stateBoundaries: [number, number][]) {
	const startIndex = Math.min(stateBoundaries[0][0], stateBoundaries[1][0]) - 1;
	const endIndex = Math.max(stateBoundaries[0][1], stateBoundaries[1][1]) + 1;

	const epsilonTransitionsRecord: IFiniteAutomaton['automaton']['epsilon_transitions'] = {
		[startIndex]: [stateBoundaries[0][0].toString()],
		[stateBoundaries[0][1]]: [stateBoundaries[1][0].toString()],
		[stateBoundaries[1][1]]: [endIndex.toString()],
	};
	return {
		stateBoundaries: [startIndex, endIndex] as [number, number],
		epsilonTransitionsRecord,
	};
}

export function generateTransitionsForOr(stateBoundaries: [number, number][]) {
	const startIndex = Math.min(stateBoundaries[0][0], stateBoundaries[1][0]) - 1;
	const endIndex = Math.max(stateBoundaries[0][1], stateBoundaries[1][1]) + 1;

	const epsilonTransitionsRecord: IFiniteAutomaton['automaton']['epsilon_transitions'] = {
		[startIndex]: [`${stateBoundaries[0][0]}`, `${stateBoundaries[1][0]}`],
		[stateBoundaries[0][1]]: [`${endIndex}`],
		[stateBoundaries[1][1]]: [`${endIndex}`],
	};
	return {
		stateBoundaries: [startIndex, endIndex] as [number, number],
		epsilonTransitionsRecord,
	};
}
