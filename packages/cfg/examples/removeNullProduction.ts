import { removeNullProduction } from '@fauton/cfg';

const nullRemovedCfg = removeNullProduction({
	productionRules: {
		Sub: ['Adj Verb Adj Conj'],
		Adj: ['a Adj', ''],
		Verb: ['b Verb', ''],
		Conj: ['c'],
	},
	variables: ['Sub', 'Adj', 'Verb', 'Conj'],
	startVariable: 'Sub',
});

console.log(JSON.stringify(nullRemovedCfg, null, 2));
