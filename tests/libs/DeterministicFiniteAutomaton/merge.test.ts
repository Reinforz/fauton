import { merge } from '../../../src/libs/DeterministicFiniteAutomaton/utils/merge';
import { IFiniteAutomaton } from '../../../src/types';

const dfa1: IFiniteAutomaton = {
	automaton: {
		label: 'divisible_by_3',
		alphabets: ['0', '1'],
		final_states: ['A'],
		start_state: 'A',
		epsilon_transitions: null,
		states: ['A', 'B', 'C'],
		transitions: {
			A: {
				0: ['A'],
				1: ['B'],
			},
			B: {
				0: ['C'],
				1: ['A'],
			},
			C: {
				0: ['B'],
				1: ['C'],
			},
		},
		description: 'Dfa to accept strings divisible by 3',
	},
	automatonId: 'abc',
	testLogic: (inputString) => parseInt(inputString, 2) % 3 === 0,
};

const dfa2: IFiniteAutomaton = {
	automaton: {
		epsilon_transitions: null,
		alphabets: ['0', '1'],
		final_states: ['X'],
		label: 'divisible_by_2',
		start_state: 'X',
		states: ['X', 'Y'],
		transitions: {
			X: {
				0: ['X'],
				1: ['Y'],
			},
			Y: {
				0: ['X'],
				1: ['Y'],
			},
		},
		description: 'Dfa to accept strings divisible by 2',
	},
	testLogic: (inputString) => parseInt(inputString, 2) % 2 === 0,
	automatonId: '123',
};

const commonMergedDfaAutomatonData = {
	alphabets: ['0', '1'],
	start_state: 'A.X',
	states: ['A.X', 'B.X', 'C.X', 'A.Y', 'B.Y', 'C.Y'],
	transitions: {
		'A.X': {
			0: ['A.X'],
			1: ['B.Y'],
		},
		'B.X': {
			0: ['C.X'],
			1: ['A.Y'],
		},
		'C.X': {
			0: ['B.X'],
			1: ['C.Y'],
		},
		'A.Y': {
			0: ['A.X'],
			1: ['B.Y'],
		},
		'B.Y': {
			0: ['C.X'],
			1: ['A.Y'],
		},
		'C.Y': {
			0: ['B.X'],
			1: ['C.Y'],
		},
	},
	epsilon_transitions: null,
};

it(`Should work for AND operation`, () => {
	const mergedAutomaton = merge(dfa1, dfa2, 'and');
	expect(mergedAutomaton.testLogic('110', true)).toStrictEqual(true);
	expect(mergedAutomaton.testLogic('10', false)).toStrictEqual(false);
	expect(mergedAutomaton.automatonId).toStrictEqual('abc.123');
	expect(mergedAutomaton.automaton).toStrictEqual({
		description: 'AND(Dfa to accept strings divisible by 3, Dfa to accept strings divisible by 2)',
		label: 'and(divisible_by_3, divisible_by_2)',
		final_states: ['A.X'],
		...commonMergedDfaAutomatonData,
	});
});

it(`Should work for OR operation`, () => {
	const mergedAutomaton = merge(dfa1, dfa2, 'or');
	expect(mergedAutomaton.testLogic('110', true)).toStrictEqual(true);
	expect(mergedAutomaton.testLogic('10', true)).toStrictEqual(true);
	expect(mergedAutomaton.testLogic('101', false)).toStrictEqual(false);
	expect(mergedAutomaton.testLogic('11', true)).toStrictEqual(true);
	expect(mergedAutomaton.automaton).toStrictEqual({
		description: 'OR(Dfa to accept strings divisible by 3, Dfa to accept strings divisible by 2)',
		label: 'or(divisible_by_3, divisible_by_2)',
		final_states: ['A.X', 'B.X', 'C.X', 'A.Y'],
		...commonMergedDfaAutomatonData,
	});
	expect(mergedAutomaton.automatonId).toStrictEqual('abc.123');
});

it(`Should work for OR operation for same dfa`, () => {
	const mergedAutomaton = merge(dfa1, dfa1, 'or');
	expect(mergedAutomaton.testLogic('101', false)).toStrictEqual(false);
	expect(mergedAutomaton.testLogic('11', true)).toStrictEqual(true);
	expect(mergedAutomaton.automaton).toStrictEqual({
		description: 'OR(Dfa to accept strings divisible by 3, Dfa to accept strings divisible by 3)',
		label: 'or(divisible_by_3, divisible_by_3)',
		alphabets: ['0', '1'],
		final_states: ['A'],
		start_state: 'A',
		epsilon_transitions: null,
		states: ['A', 'B', 'C'],
		transitions: dfa1.automaton.transitions,
	});
	expect(mergedAutomaton.automatonId).toStrictEqual('abc');
});

it(`Should work for and operation for same dfa`, () => {
	const mergedAutomaton = merge(dfa1, dfa1, 'and');
	expect(mergedAutomaton.testLogic('101', false)).toStrictEqual(false);
	expect(mergedAutomaton.testLogic('11', true)).toStrictEqual(true);
	expect(mergedAutomaton.automaton).toStrictEqual({
		description: 'AND(Dfa to accept strings divisible by 3, Dfa to accept strings divisible by 3)',
		label: 'and(divisible_by_3, divisible_by_3)',
		alphabets: ['0', '1'],
		final_states: ['A'],
		start_state: 'A',
		epsilon_transitions: null,
		states: ['A', 'B', 'C'],
		transitions: dfa1.automaton.transitions,
	});
	expect(mergedAutomaton.automatonId).toStrictEqual('abc');
});

it(`Should work for NOT operation`, () => {
	const mergedAutomaton = merge(dfa1, undefined, 'not');
	expect(mergedAutomaton.testLogic('101', true)).toStrictEqual(true);
	expect(mergedAutomaton.testLogic('11', false)).toStrictEqual(false);
	expect(mergedAutomaton.automaton).toStrictEqual({
		alphabets: ['0', '1'],
		final_states: ['B', 'C'],
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: {
				0: ['A'],
				1: ['B'],
			},
			B: {
				0: ['C'],
				1: ['A'],
			},
			C: {
				0: ['B'],
				1: ['C'],
			},
		},
		description: 'NOT(Dfa to accept strings divisible by 3)',
		label: 'not(divisible_by_3)',
		epsilon_transitions: null,
	});
});
