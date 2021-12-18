import { removeEmptyProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeEmptyProduction';

it(`Should remove empty production variables from production rules record and variables array`, () => {
	expect(
		removeEmptyProduction({
			productionRules: {
				S: ['C', '', 'B', 'BC', 'A', 'AC', 'AB', 'ABC'],
				A: ['a', 'aA'],
				B: ['b', 'bB'],
				C: [],
			},
			variables: ['S', 'A', 'B', 'C'],
		})
	).toStrictEqual({
		productionRules: {
			S: ['', 'B', 'A', 'AB'],
			A: ['a', 'aA'],
			B: ['b', 'bB'],
		},
		variables: ['S', 'A', 'B'],
	});
});
