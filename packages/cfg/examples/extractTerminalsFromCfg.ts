import { extractTerminalsFromCfg } from '@fauton/cfg';

const extractedTerminals = extractTerminalsFromCfg({
	productionRules: {
		S: ['Noun Verb Adj'],
		Verb: ['walk', 'talk'],
		Noun: ['Sam', 'Alice'],
		Adj: ['quickly'],
	},
	startVariable: 'S',
	terminals: [],
	variables: ['S', 'Verb', 'Noun', 'Adj'],
});

console.log(extractedTerminals);
