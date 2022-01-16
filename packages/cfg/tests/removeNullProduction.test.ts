import {
	createProductionCombinations,
	findNullableVariables,
	removeNullProduction,
} from '../libs/removeNullProduction';
import { arrayEquivalency } from './setEquivalency';

describe('removeNullProduction', () => {
	it(`removeNullProduction`, () => {
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

		expect(productionRules).toStrictEqual({
			Sub: [
				'Conj',
				'Verb Conj',
				'Adj Conj',
				'Adj Verb Conj',
				'Verb Adj Conj',
				'Adj Adj Conj',
				'Adj Verb Adj Conj',
			],
			Adj: ['a', 'a Adj'],
			Verb: ['b', 'b Verb'],
			Conj: ['c'],
		});
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
			Sub: ['Sub Verb', 'Adj Sub', 'Adj Sub Verb', 'another'],
			Adj: ['another Sub', 'another Adj Sub', 'another'],
			Verb: ['Sub before Sub', 'Adj', 'before before'],
		});
	});
});

it(`Should create all combinations of production rules`, () => {
	expect(createProductionCombinations('Adj be Adj', 'Adj', 'be')).toStrictEqual([
		['Adj be', 'be Adj', 'Adj be Adj'],
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
				variables: ['Sub', 'Adj', 'Verb', 'Conj', 'Det', 'Noun'],
			}),
			['Adj', 'Verb', 'Det', 'Sub']
		)
	).toBe(true);
});
