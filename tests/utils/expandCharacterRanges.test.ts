import { expandCharacterRanges } from '../../src/utils/expandCharacterRanges';

it(`Should work with upper case`, () => {
	expect(expandCharacterRanges('A-E')).toStrictEqual(['A', 'B', 'C', 'D', 'E']);
});

it(`Should work with negative numbers case`, () => {
	expect(expandCharacterRanges('-E')).toStrictEqual(['-E']);
});

it(`Should work with lowercase case`, () => {
	expect(expandCharacterRanges('a-e')).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
});

it(`Should work with numbers`, () => {
	expect(expandCharacterRanges('1-5')).toStrictEqual(['1', '2', '3', '4', '5']);
});

it(`Should work with multiple character classes`, () => {
	expect(expandCharacterRanges('a-e,1-5')).toStrictEqual([
		'a',
		'b',
		'c',
		'd',
		'e',
		'1',
		'2',
		'3',
		'4',
		'5',
	]);
});

it(`Should work for regular symbols classes`, () => {
	expect(expandCharacterRanges('a')).toStrictEqual(['a']);
});

it(`Should skip expansion altogether`, () => {
	expect(expandCharacterRanges('a-b', true)).toStrictEqual(['a-b']);
});
