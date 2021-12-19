import {
	createProductionCombinations,
	findFirstNullProductionRule,
	removeNullProduction,
} from '../../../src/libs/ContextFreeGrammar/utils/removeNullProduction';
import { arrayEquivalency } from '../../setEquivalency';

it(`Should remove null production from transition record`, () => {
	const nullProductionRemovedTransition = removeNullProduction({
		productionRules: {
			S: ['ABAC'],
			A: ['aA', ''],
			B: ['bB', ''],
			C: ['c'],
		},
		variables: ['S', 'A', 'B', 'C'],
		startVariable: 'S',
	});

	const { productionRules } = nullProductionRemovedTransition;
	expect(arrayEquivalency(productionRules.S, ['AAC', 'ABAC', 'ABC', 'AC', 'BAC', 'BC', 'C'])).toBe(
		true
	);
	expect(arrayEquivalency(productionRules.A, ['aA', 'a'])).toBe(true);
	expect(arrayEquivalency(productionRules.B, ['bB', 'b'])).toBe(true);
	expect(arrayEquivalency(productionRules.C, ['c'])).toBe(true);
});

it(`Should not remove null production from transition record if start symbol contains epsilon`, () => {
	const nullProductionRemovedTransition = removeNullProduction({
		startVariable: 'S',
		productionRules: {
			S: ['A', 'B', 'C'],
			A: ['aAf', '', 'B'],
			B: ['bBe', '', 'C'],
			C: ['cCd', ''],
		},
		variables: ['S', 'A', 'B', 'C'],
	});

	expect(nullProductionRemovedTransition).toStrictEqual({
		productionRules: {
			S: ['A', '', 'B', 'C'],
			A: ['af', 'aAf', 'B'],
			B: ['be', 'bBe', 'C'],
			C: ['cd', 'cCd'],
		},
		variables: ['S', 'A', 'B', 'C'],
	});
});

it(`Should find the first null production rule`, () => {
	expect(
		findFirstNullProductionRule({
			productionRules: {
				S: ['ABAC'],
				A: ['aA', ''],
				B: ['bB', ''],
				C: ['c'],
			},
			variables: ['S', 'A', 'B', 'C'],
			startVariable: 'S',
		})
	).toStrictEqual([1, 1]);
});

it(`Should create all combinations of production rules`, () => {
	expect(createProductionCombinations('AbA', 'A')).toStrictEqual([
		['b', 'Ab', 'bA', 'AbA'],
		false,
		2,
	]);
});