import { generateUniversalLanguage } from '../libs/utils/generateUniversalLanguage';

it(`Should generate string combinations`, () => {
	expect(generateUniversalLanguage(['a', 'b', 'c'], 3, 2)).toStrictEqual([
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

it(`Should generate string combinations when callback is present`, () => {
	const mockFn = jest.fn();
	expect(generateUniversalLanguage(['a', 'b'], 2, undefined, mockFn)).toStrictEqual([
		'a',
		'b',
		'aa',
		'ab',
		'ba',
		'bb',
	]);
	expect(mockFn.mock.calls).toEqual([['a'], ['b'], ['aa'], ['ab'], ['ba'], ['bb']]);
});
