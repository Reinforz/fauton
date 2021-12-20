import { removeUnreachableProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeUnreachableProduction';

it(`Should remove unreachable production rules and variables`, () => {
	const cfgOption = {
		productionRules: {
			Sub: ['Adj Verb'],
			Adj: ['an Adj', 'an'],
			Verb: ['be Verb', 'be'],
			Conj: ['can Conj', 'can'],
		},
		startVariable: 'Sub',
		variables: ['Sub', 'Adj', 'Verb', 'Conj'],
	};

	expect(removeUnreachableProduction(cfgOption)).toStrictEqual(['Sub', 'Adj', 'Verb']);
	expect(cfgOption.productionRules).toStrictEqual({
		Sub: ['Adj Verb'],
		Adj: ['an Adj', 'an'],
		Verb: ['be Verb', 'be'],
	});
});
