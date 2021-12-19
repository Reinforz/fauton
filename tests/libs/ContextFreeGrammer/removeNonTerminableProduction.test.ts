import { removeNonTerminableProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeNonTerminableProduction';

it(`Should remove non terminable production rules and variables`, () => {
	const cfgOption = {
		productionRules: {
			S: ['AC', 'B'],
			A: ['a'],
			C: ['c', 'BC'],
			E: ['aA', 'e'],
			B: ['B'],
		},
		startVariable: 'S',
		variables: ['S', 'A', 'C', 'E', 'B'],
		terminals: ['a', 'c', 'e'],
	};

	expect(removeNonTerminableProduction(cfgOption)).toStrictEqual(['S', 'A', 'C', 'E']);
	expect(cfgOption.productionRules).toStrictEqual({
		S: ['AC'],
		A: ['a'],
		C: ['c'],
		E: ['aA', 'e'],
	});
});
