import { removeUnreachableProduction } from '@fauton/cfg';

const unreachableRemovedCfg = removeUnreachableProduction({
	productionRules: {
		Sub: ['Adj Verb'],
		Adj: ['an Adj', 'an'],
		Verb: ['be Verb', 'be'],
		Conj: ['can Conj', 'can'],
	},
	startVariable: 'Sub',
	variables: ['Sub', 'Adj', 'Verb', 'Conj'],
});

console.log(JSON.stringify(unreachableRemovedCfg, null, 2));
