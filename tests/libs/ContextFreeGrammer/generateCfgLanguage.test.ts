import { generateCfgLanguage } from '../../../src/libs/ContextFreeGrammar/utils/generateCfgLanguage';

it(`Should generate the language of a CFG`, () => {
	const cfgLanguage = generateCfgLanguage(
		{
			startVariable: 'S',
			terminals: ['0', '1', '+', '-'],
			productionRules: {
				S: ['N', 'SEN'],
				N: ['0', '1'],
				E: ['+', '-'],
			},
			variables: ['S', 'N', 'E'],
		},
		3
	);

	expect(cfgLanguage.tree).toStrictEqual({
		'0': {
			rules: [
				['S', 0],
				['N', 0],
			],
			word: '0',
			label: 'S -> N -> 0',
			path: ['S', 'N', '0'],
		},
		'1': {
			rules: [
				['S', 0],
				['N', 1],
			],
			word: '1',
			label: 'S -> N -> 1',
			path: ['S', 'N', '1'],
		},
		'1+1': {
			rules: [
				['S', 1],
				['S', 0],
				['N', 1],
				['E', 0],
				['N', 1],
			],
			word: '1+1',
			label: 'S -> N',
			path: ['S', 'SEN', 'NEN', '1EN', '1+N', '1+1'],
		},
	});

	expect(cfgLanguage.language).toStrictEqual([
		'0',
		'1',
		'0+0',
		'0+1',
		'0-1',
		'0-0',
		'1+0',
		'1+1',
		'1-1',
		'1-0',
	]);
});
