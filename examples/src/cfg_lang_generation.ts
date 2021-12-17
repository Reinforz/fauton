import { GenerateString } from 'fauton';

const cfgLanguage = GenerateString.generateCfgLanguage(
	{
		startVariable: 'S',
		terminals: ['0', '1', '+', '-', '/', '*', '(', ')'],
		transitionRecord: {
			S: ['S', 'SEN', '(S)', 'N'],
			N: ['0', '1'],
			E: ['+', '-', '/', '*'],
		},
		variables: ['S', 'N', 'E'],
	},
	// Maximum length of the string
	3
);

console.log(Object.keys(cfgLanguage));
