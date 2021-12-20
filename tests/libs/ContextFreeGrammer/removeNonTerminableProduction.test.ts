import { removeNonTerminableProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeNonTerminableProduction';

it(`Should remove non terminable production rules and variables`, () => {
	const cfg = {
		productionRules: {
			S: ['Adj Con', 'Verb'],
			Adj: ['another'],
			Con: ['can', 'Verb Con'],
			E: ['another Adj', 'early'],
			Verb: ['Verb'],
		},
		startVariable: 'S',
		variables: ['S', 'Adj', 'Con', 'E', 'Verb'],
		terminals: ['another', 'can', 'early'],
	};

	expect(removeNonTerminableProduction(cfg)).toStrictEqual(['S', 'Adj', 'Con', 'E']);
	expect(cfg.productionRules).toStrictEqual({
		S: ['Adj Con'],
		Adj: ['another'],
		Con: ['can'],
		E: ['another Adj', 'early'],
	});
});
