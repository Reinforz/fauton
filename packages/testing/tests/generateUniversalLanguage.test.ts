import { generateUniversalLanguage } from '../libs/utils/generateUniversalLanguage';

describe('generateUniversalLanguage', () => {
	it(`Generate all string combinations`, () => {
		expect(generateUniversalLanguage(['a', 'b', 'c'], 3, 2)).toStrictEqual([
			['a', 'a'],
			['a', 'b'],
			['a', 'c'],
			['b', 'a'],
			['b', 'b'],
			['b', 'c'],
			['c', 'a'],
			['c', 'b'],
			['c', 'c'],
			['a', 'a', 'a'],
			['a', 'a', 'b'],
			['a', 'a', 'c'],
			['a', 'b', 'a'],
			['a', 'b', 'b'],
			['a', 'b', 'c'],
			['a', 'c', 'a'],
			['a', 'c', 'b'],
			['a', 'c', 'c'],
			['b', 'a', 'a'],
			['b', 'a', 'b'],
			['b', 'a', 'c'],
			['b', 'b', 'a'],
			['b', 'b', 'b'],
			['b', 'b', 'c'],
			['b', 'c', 'a'],
			['b', 'c', 'b'],
			['b', 'c', 'c'],
			['c', 'a', 'a'],
			['c', 'a', 'b'],
			['c', 'a', 'c'],
			['c', 'b', 'a'],
			['c', 'b', 'b'],
			['c', 'b', 'c'],
			['c', 'c', 'a'],
			['c', 'c', 'b'],
			['c', 'c', 'c'],
		]);
	});
});

it(`Should generate string combinations when callback is present`, () => {
	const mockFn = jest.fn();
	expect(generateUniversalLanguage(['a', 'b'], 2, undefined, mockFn)).toStrictEqual([
		['a'],
		['b'],
		['a', 'a'],
		['a', 'b'],
		['b', 'a'],
		['b', 'b'],
	]);

	expect(mockFn.mock.calls).toEqual([
		[['a']],
		[['b']],
		[['a', 'a']],
		[['a', 'b']],
		[['b', 'a']],
		[['b', 'b']],
	]);
});
