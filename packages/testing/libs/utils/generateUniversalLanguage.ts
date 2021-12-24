/**
 * Generates all combination of strings that can be made by the alphabet from length 1 to `maxLength`
 * @param alphabet Alphabet of the strings
 * @param maxLength Max length of the generated strings
 * @param startLength Starting length of the string
 * @param languageChecker A cb passed each generated string
 * @returns An array of strings
 */
export function generateUniversalLanguage(
	alphabet: string[],
	maxLength: number,
	startLength?: number,
	// eslint-disable-next-line
	cb?: (inputString: string) => void
) {
	const generatedStrings: Array<string> = [];

	function generateAllKLength(generatedString: string, stringLength: number) {
		if (stringLength === 0) {
			if (cb) {
				cb(generatedString);
			}
			generatedStrings.push(generatedString);
			return;
		}
		for (let i = 0; i < alphabet.length; i += 1) {
			generateAllKLength(generatedString + alphabet[i], stringLength - 1);
		}
	}

	for (let length = startLength ?? 1; length <= maxLength; length += 1) {
		generateAllKLength('', length);
	}

	return generatedStrings;
}
