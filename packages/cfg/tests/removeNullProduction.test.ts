import {
	createProductionCombinations,
	findNullableVariables,
	removeNullProduction,
} from '../libs/removeNullProduction';
import { arrayEquivalency } from './setEquivalency';

describe('removeNullProduction', () => {
	it(`Known variables present in production rules`, () => {
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

	it(`Unknown variable in production rules`, () => {
		const productionRules = {
			Sub: ['Adj', 'Verb', 'Conj'],
			Adj: ['an Adj for', '', 'Verb'],
			Verb: ['be Verb early', '', 'Conj'],
			Conj: ['can Conj do', ''],
		};
		removeNullProduction({
			startVariable: 'Sub',
			productionRules,
			// Note that Unknown is not present in productionRules
			variables: ['Sub', 'Adj', 'Verb', 'Conj', 'Unknown'],
		});

		expect(productionRules).toStrictEqual({
			Sub: ['Adj', 'Verb', 'Conj'],
			Adj: ['an for', 'an Adj for', 'Verb'],
			Verb: ['be early', 'be Verb early', 'Conj'],
			Conj: ['can do', 'can Conj do'],
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
