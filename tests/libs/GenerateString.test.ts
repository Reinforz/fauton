import { GenerateString } from '../../src/libs/GenerateString';

it(`Should generate string combinations`, () => {
	expect(
		GenerateString.generateAllCombosWithinLength(['a', 'b', 'c'], 3, 2, () => {})
	).toStrictEqual([
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
