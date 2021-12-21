import { generateCfgLanguage } from '../../../src/libs/ContextFreeGrammar/utils/generateCfgLanguage';

it(`Should generate the language of a CFG`, () => {
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
			maxLength: 3,
			minLength: 1,
			generateTerminals: false,
			skipSimplification: true,
			skipValidation: true,
		}
	);

	expect(cfgLanguage.tree).toStrictEqual({
		'0': {
			path: ['S', '(Num)', '(0)'],
			rules: [
				['S', 0],
				['Num', 0],
			],
			sentence: '0',
			label: 'S -> (Num) -> (0)',
			chunks: ['0'],
		},
		'1': {
			path: ['S', '(Num)', '(1)'],
			rules: [
				['S', 0],
				['Num', 1],
			],
			sentence: '1',
			label: 'S -> (Num) -> (1)',
			chunks: ['1'],
		},
		'0 + 0': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(0) Op Num', '0 (+) Num', '0 + (0)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 0],
				['Op', 0],
				['Num', 0],
			],
			sentence: '0 + 0',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (0) Op Num -> 0 (+) Num -> 0 + (0)',
			chunks: ['0', '+', '0'],
		},
		'0 + 1': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(0) Op Num', '0 (+) Num', '0 + (1)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 0],
				['Op', 0],
				['Num', 1],
			],
			sentence: '0 + 1',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (0) Op Num -> 0 (+) Num -> 0 + (1)',
			chunks: ['0', '+', '1'],
		},
		'0 - 0': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(0) Op Num', '0 (-) Num', '0 - (0)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 0],
				['Op', 1],
				['Num', 0],
			],
			sentence: '0 - 0',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (0) Op Num -> 0 (-) Num -> 0 - (0)',
			chunks: ['0', '-', '0'],
		},
		'0 - 1': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(0) Op Num', '0 (-) Num', '0 - (1)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 0],
				['Op', 1],
				['Num', 1],
			],
			sentence: '0 - 1',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (0) Op Num -> 0 (-) Num -> 0 - (1)',
			chunks: ['0', '-', '1'],
		},
		'1 + 0': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(1) Op Num', '1 (+) Num', '1 + (0)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 1],
				['Op', 0],
				['Num', 0],
			],
			sentence: '1 + 0',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (1) Op Num -> 1 (+) Num -> 1 + (0)',
			chunks: ['1', '+', '0'],
		},
		'1 + 1': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(1) Op Num', '1 (+) Num', '1 + (1)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 1],
				['Op', 0],
				['Num', 1],
			],
			sentence: '1 + 1',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (1) Op Num -> 1 (+) Num -> 1 + (1)',
			chunks: ['1', '+', '1'],
		},
		'1 - 0': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(1) Op Num', '1 (-) Num', '1 - (0)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 1],
				['Op', 1],
				['Num', 0],
			],
			sentence: '1 - 0',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (1) Op Num -> 1 (-) Num -> 1 - (0)',
			chunks: ['1', '-', '0'],
		},
		'1 - 1': {
			path: ['S', '(S Op Num)', '(Num) Op Num', '(1) Op Num', '1 (-) Num', '1 - (1)'],
			rules: [
				['S', 1],
				['S', 0],
				['Num', 1],
				['Op', 1],
				['Num', 1],
			],
			sentence: '1 - 1',
			label: 'S -> (S Op Num) -> (Num) Op Num -> (1) Op Num -> 1 (-) Num -> 1 - (1)',
			chunks: ['1', '-', '1'],
		},
	});

	expect(cfgLanguage.language).toStrictEqual([
		'0',
		'1',
		'0 + 0',
		'0 + 1',
		'0 - 0',
		'0 - 1',
		'1 + 0',
		'1 + 1',
		'1 - 0',
		'1 - 1',
	]);
});

it(`Should not skip validation and simplification`, () => {
	// To cover case where we are not skipping validation and simplification
	const cfgLanguage = generateCfgLanguage(
		{
			startVariable: 'S',
			terminals: ['0', '1'],
			productionRules: {
				S: ['Num'],
				Num: ['0', '1'],
			},
			variables: [],
		},
		{
			maxLength: 3,
			minLength: 1,
			generateVariables: true,
			autoCapitalize: false,
		}
	);

	expect(cfgLanguage.tree).toStrictEqual({
		'0': {
			path: ['S', '(0)'],
			rules: [['S', 0]],
			sentence: '0',
			label: 'S -> (0)',
			chunks: ['0'],
		},
		'1': {
			path: ['S', '(1)'],
			rules: [['S', 1]],
			sentence: '1',
			label: 'S -> (1)',
			chunks: ['1'],
		},
	});

	expect(cfgLanguage.language).toStrictEqual(['0', '1']);
});
