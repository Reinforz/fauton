import { checkForTermination } from '../../../src/libs/ContextFreeGrammar/utils/checkForTermination';

it(`Should check if the production rule can be terminated`, () => {
	expect(
		checkForTermination({
			productionRules: {
				S: ['AB'],
				A: ['aA', 'a'],
				B: ['AB'],
			},
			terminals: ['a'],
			variables: ['S', 'A', 'B'],
		})
	).toBe(false);
});
