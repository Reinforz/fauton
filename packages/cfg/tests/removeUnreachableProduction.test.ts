import { removeUnreachableProduction } from '../libs/removeUnreachableProduction';

describe('removeUnreachableProduction', () => {
	it(`Remove unreachable production`, () => {
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
		const reachableVariables = removeUnreachableProduction(cfg);
		expect(reachableVariables).toStrictEqual(['Sub', 'Noun', 'Adj', 'Verb']);
		expect(cfg.productionRules).toStrictEqual({
			Sub: ['Noun', 'Adj Verb'],
			Adj: ['an Adj', 'an'],
			Verb: ['be Verb', 'be'],
		});
	});
});
