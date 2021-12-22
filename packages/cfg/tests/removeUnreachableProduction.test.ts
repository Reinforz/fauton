import { removeUnreachableProduction } from '../libs/removeUnreachableProduction';

it(`Should remove unreachable production rules and variables`, () => {
	const cfg = {
		productionRules: {
			Sub: ['Adj Verb'],
			Adj: ['an Adj', 'an'],
			Verb: ['be Verb', 'be'],
			Conj: ['can Conj', 'can'],
		},
		startVariable: 'Sub',
		variables: ['Sub', 'Adj', 'Verb', 'Conj'],
	};

	expect(removeUnreachableProduction(cfg)).toStrictEqual(['Sub', 'Adj', 'Verb']);
	expect(cfg.productionRules).toStrictEqual({
		Sub: ['Adj Verb'],
		Adj: ['an Adj', 'an'],
		Verb: ['be Verb', 'be'],
	});
});
