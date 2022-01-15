import { removeEmptyProduction } from '../libs/removeEmptyProduction';

describe('removeEmptyProduction', () => {
	it(`removeEmptyProduction`, () => {
		const productionRules = {
			S: ['Verb', '', 'B', 'B Verb', 'A', 'A Verb', 'A B', 'A B Verb'],
			A: ['a', 'a A'],
			B: ['b', 'b B'],
			Verb: [],
		};
		const nonEmptyProductionVariables = removeEmptyProduction({
			productionRules,
			variables: ['S', 'A', 'B', 'Verb'],
		});
		expect(productionRules).toStrictEqual({
			S: ['', 'B', 'A', 'A B'],
			A: ['a', 'a A'],
			B: ['b', 'b B'],
		});
		expect(nonEmptyProductionVariables).toStrictEqual(['S', 'A', 'B']);
	});
});
