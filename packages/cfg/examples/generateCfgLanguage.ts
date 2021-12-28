import { generateCfgLanguage } from '@fauton/cfg';

const cfgLanguage = generateCfgLanguage(
	{
		startVariable: 'S',
		terminals: ['0', '1', '+', '-'],
		productionRules: {
			S: ['Num', 'S Op Num'],
			Num: ['0', '1'],
			Op: ['+', '-'],
		},
		variables: ['S', 'Num', 'Op'],
	},
	{
		maxTokenLength: 3,
		minTokenLength: 1,
		generateTerminals: false,
		skipSimplification: true,
		skipValidation: true,
		parseDirection: 'right',
		useSpaceWhenJoiningTokens: false,
	}
);

console.log(JSON.stringify(cfgLanguage, null, 2));
