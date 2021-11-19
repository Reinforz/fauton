import { expandCharacterClasses } from '../../src/utils/expandCharacterClasses';

it(`Should work with upper case`, () => {
	expect(expandCharacterClasses('A-E')).toStrictEqual(['A', 'B', 'C', 'D', 'E']);
});

it(`Should work with lowercase case`, () => {
	expect(expandCharacterClasses('a-e')).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
});

it(`Should work with multiple character classes`, () => {
	expect(expandCharacterClasses('a-e,1-5')).toStrictEqual([
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
