import { removeUnitProduction } from '@fauton/cfg';

const unitRemovedCfg = removeUnitProduction({
	productionRules: {
		Sub: ['0 Adj', '1 Verb', 'Conj'],
		Adj: ['0 Sub', '0 0'],
		Verb: ['1', 'Adj'],
		Conj: ['0 1'],
	},
	variables: ['Sub', 'Adj', 'Verb', 'Conj'],
});

console.log(JSON.stringify(unitRemovedCfg, null, 2));
