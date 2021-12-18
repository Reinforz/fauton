import { ContextFreeGrammarUtils } from 'fauton';

console.log(
	ContextFreeGrammarUtils.removeUnreachableProduction({
		productionRules: {
			S: ['AB'],
			A: ['aA', 'a'],
			B: ['bB', 'b'],
			C: ['cC', 'c'],
		},
		startVariable: 'S',
		variables: ['S', 'A', 'B', 'C'],
	})
);
