import { convertToCnf } from '@fauton/cfg';

const cnf = convertToCnf({
	productionRules: {
		S: ['A S A', 'a B'],
		A: ['B', 'S'],
		B: ['b', ''],
	},
	startVariable: 'S',
	terminals: ['a', 'b'],
	variables: ['S', 'A', 'B'],
});

console.log(JSON.stringify(cnf, null, 2));
