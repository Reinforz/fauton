import { generateRandomLanguage } from '../libs/utils/generateRandomLanguage';

it(`Should generate random unique strings within length`, () => {
	const randomStrings = generateRandomLanguage(10, ['a', 'b', 'c'], 5, 5);
	expect(randomStrings.length).toBe(10);
	expect(new Set(randomStrings).size === 10).toBe(true);

	const randomStrings2 = generateRandomLanguage(0, ['a', 'b', 'c'], 5, 5, ['a', 'b', 'c']);
	expect(randomStrings2.includes('a'));
	expect(randomStrings2.includes('b'));
	expect(randomStrings2.includes('c'));
});
