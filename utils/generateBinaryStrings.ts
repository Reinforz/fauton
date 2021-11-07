interface IOptions {
	withoutPadding: boolean;
}

export default function generateBinaryStrings(bitsLimit: number, options?: Partial<IOptions>) {
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
