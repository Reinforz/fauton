import {
	createProductionCombinations,
	findNullableVariables,
	removeNullProduction,
} from '../../../src/libs/ContextFreeGrammar/utils/removeNullProduction';
import { arrayEquivalency } from '../../setEquivalency';

describe('Should remove null production from transition record', () => {
	it(`Sample 1`, () => {
		const productionRules = {
			S: ['ABAC'],
			A: ['aA', ''],
			B: ['bB', ''],
			C: ['c'],
		};
		removeNullProduction({
			productionRules,
			variables: ['S', 'A', 'B', 'C'],
			startVariable: 'S',
		});

		expect(
			arrayEquivalency(productionRules.S, ['AAC', 'ABAC', 'ABC', 'AC', 'BAC', 'BC', 'C'])
		).toBe(true);
		expect(arrayEquivalency(productionRules.A, ['aA', 'a'])).toBe(true);
		expect(arrayEquivalency(productionRules.B, ['bB', 'b'])).toBe(true);
		expect(arrayEquivalency(productionRules.C, ['c'])).toBe(true);
	});

	it(`Sample 2`, () => {
		const productionRules = {
			S: ['A', 'B', 'C'],
			A: ['aAf', '', 'B'],
			B: ['bBe', '', 'C'],
			C: ['cCd', ''],
		};
		removeNullProduction({
			startVariable: 'S',
			productionRules,
			variables: ['S', 'A', 'B', 'C'],
		});

		expect(productionRules).toStrictEqual({
			S: ['A', 'B', 'C'],
			A: ['af', 'aAf', 'B'],
			B: ['be', 'bBe', 'C'],
			C: ['cd', 'cCd'],
		});
	});

	it(`Sample 3`, () => {
		const productionRules = {
			S: ['ASB', 'a'],
			A: ['aAS', 'a', ''],
			B: ['SbS', 'A', 'bb'],
		};
		removeNullProduction({
			startVariable: 'S',
			productionRules,
			variables: ['S', 'A', 'B'],
		});

		expect(productionRules).toStrictEqual({
			S: ['S', 'SB', 'AS', 'ASB', 'a'],
			A: ['aS', 'aAS', 'a'],
			B: ['SbS', 'A', 'bb'],
		});
	});
});

it(`Should create all combinations of production rules`, () => {
	expect(createProductionCombinations('AbA', 'A')).toStrictEqual([
		['b', 'Ab', 'bA', 'AbA'],
		false,
		2,
	]);
});

it(`Should add null production to production rules, that references nullable variables`, () => {
	const productionRules = {
		S: ['AB', 'abc'],
		A: [''],
		B: ['A', 'b'],
		C: ['c'],
		D: ['AB', 'c'],
	};
	expect(
		arrayEquivalency(
			findNullableVariables({
				productionRules,
				variables: ['S', 'A', 'B', 'C', 'D'],
			}),
			['A', 'B', 'D', 'S']
		)
	).toBe(true);
});
