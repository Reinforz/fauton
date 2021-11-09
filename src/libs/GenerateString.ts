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
		initialBinaryStrings?: string[]
	) {
		// Using a set to store only unique binary strings
		const uniqueRandomBinaryStrings: Set<string> = new Set(initialBinaryStrings ?? []);
		while (uniqueRandomBinaryStrings.size + (initialBinaryStrings ?? []).length < total) {
			const binaryStringLength = generateRandomNumber(minLength, maxLength);
			let randomBinaryString = '';
			for (let index = 0; index < binaryStringLength; index++) {
				randomBinaryString += generateRandomNumber(0, 1);
			}

			if (!uniqueRandomBinaryStrings.has(randomBinaryString)) {
				uniqueRandomBinaryStrings.add(randomBinaryString);
			}
		}
		return Array.from(uniqueRandomBinaryStrings);
	}
}
