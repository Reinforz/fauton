import generateRandomNumber from '../utils/generateRandomNumber';

interface IOptions {
	withoutPadding: boolean;
}

export class BinaryString {
	static generateAllCombosWithinBitLimit(bitsLimit: number, options?: Partial<IOptions>) {
		const binaryStrings: Set<string> = new Set();
		const limit = Math.pow(2, bitsLimit);
		const { withoutPadding = true } = options ?? {};
		for (let i = 0; i < limit; i++) {
			const binaryString = Number(i).toString(2);
			const bitDifference = bitsLimit - binaryString.length;
			for (let index = 1; index < bitDifference; index++) {
				binaryStrings.add('0'.repeat(index) + binaryString);
			}
			if (withoutPadding) {
				binaryStrings.add(binaryString);
			}
			// Append 0 if the binary string length is less than bits limit
			const paddedBinaryString =
				binaryString.length < bitsLimit ? '0'.repeat(bitDifference) + binaryString : binaryString;
			binaryStrings.add(paddedBinaryString);
		}

		return Array.from(binaryStrings);
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
