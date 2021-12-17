import { ContextFreeGrammarUtils } from 'fauton';
const nullProductionRemovedTransition = ContextFreeGrammarUtils.removeNullProduction({
	productionRules: {
		S: ['ABAC'],
		A: ['aA', ''],
		B: ['bB', ''],
		C: ['c'],
	},
	variables: ['S', 'A', 'B', 'C'],
	startVariable: 'S',
});
console.log(nullProductionRemovedTransition);
