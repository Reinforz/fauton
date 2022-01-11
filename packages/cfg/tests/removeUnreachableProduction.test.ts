import { removeUnreachableProduction } from '../libs/removeUnreachableProduction';

it(`Should remove unreachable production rules and variables`, () => {
	const cfg = {
		productionRules: {
			Sub: ['Noun', 'Adj Verb'],
			Adj: ['an Adj', 'an'],
			Verb: ['be Verb', 'be'],
			Conj: ['can Conj', 'can'],
		},
		startVariable: 'Sub',
		variables: ['Sub', 'Adj', 'Verb', 'Conj', 'Noun'],
	};

	expect(removeUnreachableProduction(cfg)).toStrictEqual(['Sub', 'Noun', 'Adj', 'Verb']);
	expect(cfg.productionRules).toStrictEqual({
		Sub: ['Noun', 'Adj Verb'],
		Adj: ['an Adj', 'an'],
		Verb: ['be Verb', 'be'],
	});
});
