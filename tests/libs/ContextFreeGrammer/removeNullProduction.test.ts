import {
	createProductionCombinations,
	findNullableVariables,
	removeNullProduction,
} from '../../../src/libs/ContextFreeGrammar/utils/removeNullProduction';
import { arrayEquivalency } from '../../setEquivalency';

describe('Should remove null production from transition record', () => {
	it(`Sample 1`, () => {
		const productionRules = {
			Sub: ['Adj Verb Adj Conj'],
			Adj: ['a Adj', ''],
			Verb: ['b Verb', ''],
			Conj: ['c'],
		};
		removeNullProduction({
			productionRules,
			variables: ['Sub', 'Adj', 'Verb', 'Conj'],
			startVariable: 'Sub',
		});

		expect(
			arrayEquivalency(productionRules.Sub, [
				'Adj Adj Conj',
				'Adj Verb Adj Conj',
				'Adj Verb Conj',
				'Adj Conj',
				'Verb Adj Conj',
				'Verb Conj',
				'Conj',
			])
		).toBe(true);
		expect(arrayEquivalency(productionRules.Adj, ['a Adj', 'a'])).toBe(true);
		expect(arrayEquivalency(productionRules.Verb, ['b Verb', 'b'])).toBe(true);
		expect(arrayEquivalency(productionRules.Conj, ['c'])).toBe(true);
	});

	it(`Sample 2`, () => {
		const productionRules = {
			Sub: ['Adj', 'Verb', 'Conj'],
			Adj: ['an Adj for', '', 'Verb'],
			Verb: ['be Verb early', '', 'Conj'],
			Conj: ['can Conj do', ''],
		};
		removeNullProduction({
			startVariable: 'Sub',
			productionRules,
			variables: ['Sub', 'Adj', 'Verb', 'Conj'],
		});

		expect(productionRules).toStrictEqual({
			Sub: ['Adj', 'Verb', 'Conj'],
			Adj: ['an for', 'an Adj for', 'Verb'],
			Verb: ['be early', 'be Verb early', 'Conj'],
			Conj: ['can do', 'can Conj do'],
		});
	});

	it(`Sample 3`, () => {
		const productionRules = {
			Sub: ['Adj Sub Verb', 'another'],
			Adj: ['another Adj Sub', 'another', ''],
			Verb: ['Sub before Sub', 'Adj', 'before before'],
		};
		removeNullProduction({
			startVariable: 'Sub',
			productionRules,
			variables: ['Sub', 'Adj', 'Verb'],
		});

		expect(productionRules).toStrictEqual({
			Sub: ['Sub', 'Sub Verb', 'Adj Sub', 'Adj Sub Verb', 'another'],
			Adj: ['another Sub', 'another Adj Sub', 'another'],
			Verb: ['Sub before Sub', 'Adj', 'before before'],
		});
	});
});

it(`Should create all combinations of production rules`, () => {
	expect(createProductionCombinations('Adj be Adj', 'Adj')).toStrictEqual([
		['be', 'Adj be', 'be Adj', 'Adj be Adj'],
		false,
		2,
	]);
});

it(`Should find all nullable variables`, () => {
	const productionRules = {
		Sub: ['Adj Verb', 'an be can'],
		Adj: [''],
		Verb: ['Adj', 'be'],
		Conj: ['can'],
		Det: ['Adj Verb', 'can'],
	};
	expect(
		arrayEquivalency(
			findNullableVariables({
				productionRules,
				variables: ['Sub', 'Adj', 'Verb', 'Conj', 'Det'],
			}),
			['Adj', 'Verb', 'Det', 'Sub']
		)
	).toBe(true);
});
