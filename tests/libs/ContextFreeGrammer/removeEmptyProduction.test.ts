import { removeEmptyProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeEmptyProduction';

it(`Should remove empty production variables from production rules record and variables array`, () => {
	const productionRules = {
		S: ['C', '', 'B', 'BC', 'A', 'AC', 'AB', 'ABC'],
		A: ['a', 'aA'],
		B: ['b', 'bB'],
		C: [],
	};
	const updatedVariables = removeEmptyProduction({
		productionRules,
		variables: ['S', 'A', 'B', 'C'],
	});
	expect(productionRules).toStrictEqual({
		S: ['', 'B', 'A', 'AB'],
		A: ['a', 'aA'],
		B: ['b', 'bB'],
	});
	expect(updatedVariables).toStrictEqual(['S', 'A', 'B']);
});
