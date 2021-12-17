import {
	findFirstUnitProductionRule,
	removeUnitProduction,
} from '../../../src/libs/ContextFreeGrammar/utils/removeUnitProduction';

describe('.findFirstUnitProductionRule', () => {
	it(`Should find first unit production rule`, () => {
		expect(
			findFirstUnitProductionRule(['S', 'A', 'B', 'C'], {
				S: ['0A', '1B', 'C'],
				A: ['0S', '00'],
				B: ['1', 'A'],
				C: ['01'],
			})
		).toStrictEqual(['S', 2]);
	});

	it(`Should return null if no production rule returns unit`, () => {
		expect(
			findFirstUnitProductionRule(['S', 'A', 'B'], {
				S: ['0A', '1B'],
				A: ['0S', '00'],
				B: ['1'],
			})
		).toStrictEqual(null);
	});
});

describe('.removeUnitProduction', () => {
	it(`Should remove unit production rule`, () => {
		const productionRules = {
			S: ['0A', '1B', 'C'],
			A: ['0S', '00'],
			B: ['1', 'A'],
			C: ['01'],
		};

		removeUnitProduction({ productionRules, variables: ['S', 'A', 'B', 'C'] });
		expect(productionRules).toStrictEqual({
			S: ['0A', '1B', '01'],
			A: ['0S', '00'],
			B: ['1', '0S', '00'],
			C: ['01'],
		});
	});
});
