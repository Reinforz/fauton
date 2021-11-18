import { generateRandomNumber } from '../utils/generateRandomNumber';

export class GenerateString {
	/**
	 * Generates all combination of strings that can be made by the alphabet from length 1 to `maxLength`
	 * @param alphabet Alphabet of the strings
	 * @param maxLength Max length of the generated strings
	 * @param cb A cb passed each generated string
	 * @returns An array of strings
	 */
	static generateAllCombosWithinLength(
		alphabet: string[],
		maxLength: number,
		// eslint-disable-next-line
		cb?: (generatedString: string) => void
	) {
		const generatedStrings: Set<string> = new Set();

		function generateAllKLength(generatedString: string, stringLength: number) {
			if (stringLength === 0) {
				generatedStrings.add(generatedString);
				if (cb) cb(generatedString);
				return;
			}
			for (let i = 0; i < alphabet.length; i += 1) {
				generateAllKLength(generatedString + alphabet[i], stringLength - 1);
			}
		}

		for (let length = 1; length <= maxLength; length += 1) {
			generateAllKLength('', length);
		}

		return Array.from(generatedStrings);
	}

	/**
	 * Generates an array of unique random strings over a given alphabet
	 * @param total Total unique random strings
	 * @param alphabet Alphabet of the random strings
	 * @param minLength Minimum length of each string
	 * @param maxLength Maximum length of each string
	 * @param initialInputStrings Initial array of strings
	 * @returns An array of unique random strings
	 */
	static generateRandomUnique(
		total: number,
		alphabet: string[],
		minLength: number,
		maxLength: number,
		initialInputStrings?: string[]
	) {
		// Using a set to store only unique input strings
		const uniqueRandomInputStrings: Set<string> = new Set(initialInputStrings ?? []);
		while (uniqueRandomInputStrings.size + (initialInputStrings ?? []).length < total) {
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
}
