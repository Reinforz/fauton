import { generateRandomLanguage } from '../libs/utils/generateRandomLanguage';

it(`Should generate random unique strings within length`, () => {
	const randomStrings = generateRandomLanguage(10, ['a', 'b', 'c'], 5, 5);
	expect(randomStrings.length).toBe(10);
	expect(new Set(randomStrings).size === 10).toBe(true);
});
