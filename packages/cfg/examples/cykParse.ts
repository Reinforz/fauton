import { cykParse } from '@fauton/cfg';

const cykParseInfo = cykParse(
	{
		startVariable: 'S',
		productionRules: {
			S: ['A B', 'B C'],
			A: ['B A', 'a'],
			B: ['C C', 'b'],
			C: ['A B', 'a'],
		},
	},
	'b a a b a'.split(' ')
);

console.log(JSON.stringify(cykParseInfo, null, 2));
