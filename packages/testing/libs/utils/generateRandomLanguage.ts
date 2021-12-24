import { generateRandomNumber } from './generateRandomNumber';

/**
 * Generates an array of unique random strings over a given alphabet
 * @param total Total unique random strings
 * @param alphabet Alphabet of the random strings
 * @param minLength Minimum length of each string
 * @param maxLength Maximum length of each string
 * @param initialInputStrings Initial array of strings
 * @returns An array of unique random strings
 */
export function generateRandomLanguage(
	total: number,
	alphabet: string[],
	minLength: number,
	maxLength: number,
	initialInputStrings?: string[]
) {
	// Using a set to store only unique input strings
	const uniqueRandomInputStrings: Set<string> = new Set(initialInputStrings ?? []);

	while (uniqueRandomInputStrings.size < total) {
		const inputStringLength = generateRandomNumber(minLength, maxLength);
		let randomInputString = '';
		for (let index = 0; index < inputStringLength; index += 1) {
			randomInputString += alphabet[generateRandomNumber(0, alphabet.length - 1)];
		}

		if (!uniqueRandomInputStrings.has(randomInputString)) {
			uniqueRandomInputStrings.add(randomInputString);
		}
	}
	return Array.from(uniqueRandomInputStrings);
}
