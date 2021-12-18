import { removeUnreachableProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeUnreachableProduction';

it(`Should remove unreachable production rules and variables`, () => {
	expect(
		removeUnreachableProduction({
			productionRules: {
				S: ['AB'],
				A: ['aA', 'a'],
				B: ['bB', 'b'],
				C: ['cC', 'c'],
			},
			startVariable: 'S',
			variables: ['S', 'A', 'B', 'C'],
		})
	).toStrictEqual({
		productionRules: {
			S: ['AB'],
			A: ['aA', 'a'],
			B: ['bB', 'b'],
		},
		variables: ['S', 'A', 'B'],
	});
});
