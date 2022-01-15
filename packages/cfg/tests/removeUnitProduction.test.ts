import { findFirstUnitProductionRule, removeUnitProduction } from '../libs/removeUnitProduction';

describe('.findFirstUnitProductionRule', () => {
	it(`Should find first unit production rule`, () => {
		expect(
			findFirstUnitProductionRule(['Sub', 'Adj', 'Verb', 'Conj'], {
				Sub: ['0 Adj', '1 Verb', 'Conj'],
				Adj: ['0 Sub', '0 0'],
				Verb: ['1', 'Adj'],
				Conj: ['0 1'],
			})
		).toStrictEqual(['Sub', 2]);
	});

	it(`Should return null if no production rule returns unit`, () => {
		expect(
			findFirstUnitProductionRule(['Sub', 'Adj', 'Verb'], {
				Sub: ['0 Adj', '1 Verb'],
				Adj: ['0 Sub', '0 0'],
				Verb: ['1'],
			})
		).toStrictEqual(null);
	});
});

describe('removeUnitProduction', () => {
	it(`removeUnitProduction`, () => {
		const productionRules = {
			Sub: ['0 Adj', '1 Verb', 'Conj'],
			Adj: ['0 Sub', '0 0'],
			Verb: ['1', 'Adj'],
			Conj: ['0 1'],
		};

		removeUnitProduction({ productionRules, variables: ['Sub', 'Adj', 'Verb', 'Conj'] });

		expect(productionRules).toStrictEqual({
			Sub: ['0 Adj', '1 Verb', '0 1'],
			Adj: ['0 Sub', '0 0'],
			Verb: ['1', '0 Sub', '0 0'],
			Conj: ['0 1'],
		});
	});
});
