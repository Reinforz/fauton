import { removeUnreachableProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeUnreachableProduction';

it(`Should remove unreachable production rules and variables`, () => {
	const cfgOption = {
		productionRules: {
			S: ['AB'],
			A: ['aA', 'a'],
			B: ['bB', 'b'],
			C: ['cC', 'c'],
		},
		startVariable: 'S',
		variables: ['S', 'A', 'B', 'C'],
	};

	expect(removeUnreachableProduction(cfgOption)).toStrictEqual(['S', 'A', 'B']);
	expect(cfgOption.productionRules).toStrictEqual({
		S: ['AB'],
		A: ['aA', 'a'],
		B: ['bB', 'b'],
	});
});
