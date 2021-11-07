import generateRandomNumber from '../utils/generateRandomNumber';

interface IOptions {
	withoutPadding: boolean;
	cb?: (binaryString: string) => void;
}

export class BinaryString {
	static generateAllCombosWithinBitLimit(bitsLimit: number, options?: Partial<IOptions>) {
		const binaryStrings: Set<string> = new Set();
		const limit = Math.pow(2, bitsLimit);
		const { withoutPadding = true } = options ?? {};
		for (let i = 0; i < limit; i++) {
			const binaryString = Number(i).toString(2);
			const bitDifference = bitsLimit - binaryString.length;
			for (let index = 1; index <= bitDifference; index++) {
				const paddedBinaryString = '0'.repeat(index) + binaryString;
				binaryStrings.add(paddedBinaryString);
				options && options.cb && options.cb(paddedBinaryString);
			}
			if (withoutPadding) {
				binaryStrings.add(binaryString);
				options && options.cb && options.cb(binaryString);
			}
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
