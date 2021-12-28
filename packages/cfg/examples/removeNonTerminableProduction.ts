import { removeNonTerminableProduction } from '@fauton/cfg';

const nonTerminalRemovedCfg = removeNonTerminableProduction({
	productionRules: {
		S: ['Adj Con', 'Verb'],
		Adj: ['another'],
		Con: ['can', 'Verb Con'],
		E: ['another Adj', 'early'],
		Verb: ['Verb'],
	},
	variables: ['S', 'Adj', 'Con', 'E', 'Verb'],
	terminals: ['another', 'can', 'early'],
});

console.log(JSON.stringify(nonTerminalRemovedCfg, null, 2));
