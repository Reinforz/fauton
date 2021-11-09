import generateRandomNumber from '../utils/generateRandomNumber';

export class GenerateString {
	static generateAllCombosWithinLength(
		alphabets: string[],
		maxLength: number,
		cb?: (generatedString: string) => void
	) {
		const generatedStrings: Set<string> = new Set();

		for (let length = 1; length <= maxLength; length++) {
			generateAllKLength('', length);
		}

		function generateAllKLength(generatedString: string, stringLength: number) {
			if (stringLength === 0) {
				generatedStrings.add(generatedString);
				cb && cb(generatedString);
				return;
			}
			for (let i = 0; i < alphabets.length; i++) {
				generateAllKLength(generatedString + alphabets[i], stringLength - 1);
			}
		}

		return Array.from(generatedStrings);
	}

	static generateRandomUnique(
		total: number,
		minLength: number,
		maxLength: number,
		initialInputStrings?: string[]
	) {
		// Using a set to store only unique input strings
		const uniqueRandomInputStrings: Set<string> = new Set(initialInputStrings ?? []);
		while (uniqueRandomInputStrings.size + (initialInputStrings ?? []).length < total) {
			const inputStringLength = generateRandomNumber(minLength, maxLength);
			let randomInputString = '';
			for (let index = 0; index < inputStringLength; index++) {
				randomInputString += generateRandomNumber(0, 1);
			}

			if (!uniqueRandomInputStrings.has(randomInputString)) {
				uniqueRandomInputStrings.add(randomInputString);
			}
		}
		return Array.from(uniqueRandomInputStrings);
	}
}
