import { removeNonTerminableProduction } from '../libs/removeNonTerminableProduction';

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
		// Note that production rules for Noun variable is not present,
		variables: ['S', 'Adj', 'Con', 'E', 'Verb', 'Noun'],
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

it(`Should throw error if start variable is non terminable`, () => {
	const cfg = {
		productionRules: {
			S: ['S', 'Verb'],
			Verb: ['Verb'],
		},
		startVariable: 'S',
		// Note that production rules for Noun variable is not present,
		variables: ['S', 'Verb'],
		terminals: ['another', 'can', 'early'],
	};

	expect(() => removeNonTerminableProduction(cfg)).toThrow(`This grammar can't be convert to cnf`);
});
