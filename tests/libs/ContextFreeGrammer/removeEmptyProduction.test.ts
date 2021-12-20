import { removeEmptyProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeEmptyProduction';

it(`Should remove empty production variables from production rules record and variables array`, () => {
	const productionRules = {
		S: ['Verb', '', 'B', 'B Verb', 'A', 'A Verb', 'A B', 'A B Verb'],
		A: ['a', 'a A'],
		B: ['b', 'b B'],
		Verb: [],
	};
	const updatedVariables = removeEmptyProduction({
		productionRules,
		variables: ['S', 'A', 'B', 'Verb'],
	});
	expect(productionRules).toStrictEqual({
		S: ['', 'B', 'A', 'A B'],
		A: ['a', 'a A'],
		B: ['b', 'b B'],
	});
	expect(updatedVariables).toStrictEqual(['S', 'A', 'B']);
});
