import { ContextFreeGrammarUtils } from 'fauton';

const cfgLanguage = ContextFreeGrammarUtils.generateCfgLanguage(
	{
		startVariable: 'S',
		terminals: ['0', '1', '+', '-', '/', '*', '(', ')'],
		productionRules: {
			S: ['S', 'S E N', '(S)', 'N'],
			N: ['0', '1'],
			E: ['+', '-', '/', '*'],
		},
		variables: ['S', 'N', 'E'],
	},
	// Maximum length of the string
	{
		maxLength: 3,
		minLength: 1,
	}
);

console.log(cfgLanguage.language);
