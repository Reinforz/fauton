import { generateCfgLanguage } from '../../../src/libs/ContextFreeGrammar/utils/generateCfgLanguage';

it(`Should generate the language of a CFG`, () => {
	const cfgLanguage = generateCfgLanguage(
		{
			startVariable: 'S',
			terminals: ['0', '1', '+', '-'],
			transitionRecord: {
				S: ['N', 'SEN'],
				N: ['0', '1'],
				E: ['+', '-'],
			},
			variables: ['S', 'N', 'E'],
		},
		3
	);
});
