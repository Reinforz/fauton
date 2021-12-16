import { GenerateString } from '../../src/libs/GenerateString';

describe('.generateAllCombosWithinLength', () => {
	it(`Should generate string combinations`, () => {
		expect(GenerateString.generateAllCombosWithinLength(['a', 'b', 'c'], 3, 2)).toStrictEqual([
			'aa',
			'ab',
			'ac',
			'ba',
			'bb',
			'bc',
			'ca',
			'cb',
			'cc',
			'aaa',
			'aab',
			'aac',
			'aba',
			'abb',
			'abc',
			'aca',
			'acb',
			'acc',
			'baa',
			'bab',
			'bac',
			'bba',
			'bbb',
			'bbc',
			'bca',
			'bcb',
			'bcc',
			'caa',
			'cab',
			'cac',
			'cba',
			'cbb',
			'cbc',
			'cca',
			'ccb',
			'ccc',
		]);
	});
});

describe('.generateRandomUnique', () => {
	it(`Should generate random unique strings within length`, () => {
		const randomStrings = GenerateString.generateRandomUnique(10, ['a', 'b', 'c'], 5, 5);
		expect(randomStrings.length).toBe(10);
		expect(new Set(randomStrings).size === 10).toBe(true);

		const randomStrings2 = GenerateString.generateRandomUnique(0, ['a', 'b', 'c'], 5, 5, [
			'a',
			'b',
			'c',
		]);
		expect(randomStrings2.includes('a'));
		expect(randomStrings2.includes('b'));
		expect(randomStrings2.includes('c'));
	});
});

describe('.generateCfgLanguage', () => {
	it(`Should generate the language of a CFG`, () => {
		const cfgLanguage = GenerateString.generateCfgLanguage(
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
			10
		);
		console.log(cfgLanguage);
	});
});
