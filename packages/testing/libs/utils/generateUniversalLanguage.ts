/**
 * Generates all combination of strings that can be made by the tokens from length 1 to `maxTokenLength`
 * @param tokens Alphabet of the strings
 * @param maxTokenLength Max length of the generated strings
 * @param startTokenLength Starting length of the string
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
	const language: Array<Array<string>> = [];

	function generateAllKLength(generatedTokens: string[], tokensLength: number) {
		if (tokensLength === 0) {
			if (cb) {
				cb(generatedTokens);
			}
			language.push(generatedTokens);
			return;
		}
		for (let i = 0; i < tokens.length; i += 1) {
			generateAllKLength(generatedTokens.concat(tokens[i]), tokensLength - 1);
		}
	}

	for (let length = startTokenLength ?? 1; length <= maxTokenLength; length += 1) {
		generateAllKLength([], length);
	}

	return language;
}
