/**
 * Generates all combination of strings that can be using the tokens from length 1 to `maxTokenLength`
 * @param tokens Alphabet of the strings
 * @param maxTokenLength Highest number of token the generated string can have
 * @param startTokenLength Starting token length of the string
 * @param languageChecker A cb passed each generated string
 * @returns An array of strings
 */
export function generateUniversalLanguage(
	tokens: string[],
	maxTokenLength: number,
	startTokenLength?: number,
	// eslint-disable-next-line
	cb?: (inputTokens: string[]) => void
) {
	// An array to store all the generated strings
	// there is no point in using a set for two reasons
	// 1. Each string would be unique, the algorithm ensures that, ofc depending on the token
	// 2. Set would throw an error if we store huge number of items in it
	const generatedStrings: Array<Array<string>> = [];

	// Recursive function to generate all possible combinations
	function generateAllKLength(generatedTokens: string[], tokensLength: number) {
		// Base case, if we dont have any more token to use
		// Call the callback and pass the generated token
		if (tokensLength === 0) {
			if (cb) {
				cb(generatedTokens);
			}
			// Push the generated tokens to the array
			generatedStrings.push(generatedTokens);
			return;
		}
		// Loop through all the tokens and recursively call the function decreasing the token length
		for (let i = 0; i < tokens.length; i += 1) {
			generateAllKLength(generatedTokens.concat(tokens[i]), tokensLength - 1);
		}
	}

	// Generate all possible combinations of token from $startTokenLength to $maxTokenLength
	for (let length = startTokenLength ?? 1; length <= maxTokenLength; length += 1) {
		generateAllKLength([], length);
	}

	return generatedStrings;
}
