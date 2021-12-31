import { generateRandomNumber } from './generateRandomNumber';

/**
 * Generates an array of unique random strings over a given tokens
 * @param total Total unique random strings
 * @param tokens Alphabet of the random strings
 * @param minTokenLength Minimum length of each string
 * @param maxTokenLength Maximum length of each string
 * @param initialInputStrings Initial array of strings
 * @returns An array of unique random strings
 */
export function generateRandomLanguage(
	total: number,
	tokens: string[],
	minTokenLength: number,
	maxTokenLength: number,
	initialInputStrings?: string[][]
) {
	// Using a set to store only unique input strings
	const generatedStringsSet: Set<string> = new Set(
		initialInputStrings?.map((initialInputString) => initialInputString.join(' ')) ?? []
	);

	while (generatedStringsSet.size < total) {
		const tokenLength = generateRandomNumber(minTokenLength, maxTokenLength);
		const generatedTokens: string[] = [];
		for (let index = 0; index < tokenLength; index += 1) {
			generatedTokens.push(tokens[generateRandomNumber(0, tokens.length - 1)]);
		}

		generatedStringsSet.add(generatedTokens.join(' '));
	}
	const generatedStrings: string[][] = [];
	Array.from(generatedStringsSet).forEach((generatedString) => {
		generatedStrings.push(generatedString.split(' '));
	});
	return generatedStrings;
}
