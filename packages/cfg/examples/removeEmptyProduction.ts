import { removeEmptyProduction } from '@fauton/cfg';

const emptyProductionRemovedCfg = removeEmptyProduction({
	productionRules: {
		S: ['Verb', '', 'B', 'B Verb', 'A', 'A Verb', 'A B', 'A B Verb'],
		A: ['a', 'a A'],
		B: ['b', 'b B'],
		Verb: [],
	},
	variables: ['S', 'A', 'B', 'Verb'],
});

console.log(JSON.stringify(emptyProductionRemovedCfg, null, 2));
