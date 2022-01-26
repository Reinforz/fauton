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

	// WARN This could potentially cause an infinite loop,
	// While we haven't reached total tokens equal to total
	while (generatedStringsSet.size < total) {
		// Generate a random number for the token length
		const tokenLength = generateRandomNumber(minTokenLength, maxTokenLength);
		const generatedString: string[] = [];
		for (let index = 0; index < tokenLength; index += 1) {
			// Generate a random token
			generatedString.push(tokens[generateRandomNumber(0, tokens.length - 1)]);
		}
		// Add the generated string by joining the tokens with space
		generatedStringsSet.add(generatedString.join(' '));
	}
	// Using a array of tokens, rather than a set as there is a limit to the number of items a set can contain
	// If $total is a very large number using a set would throw an error
	const generatedStrings: string[][] = [];
	// Convert the set to an array
	Array.from(generatedStringsSet).forEach((generatedString) => {
		// Generate tokens from the string by splitting it via space
		generatedStrings.push(generatedString.split(' '));
	});
	return generatedStrings;
}
