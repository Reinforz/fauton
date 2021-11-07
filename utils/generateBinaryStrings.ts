interface IOptions {
	withoutPadding: boolean;
}

export default function generateBinaryStrings(bitsLimit: number, options: IOptions) {
	const binaryStrings: Set<string> = new Set();
	const limit = Math.pow(2, bitsLimit);
	// Add 0, 00, 000, 0000, up until bits limit as they are not generated
	for (let index = 1; index <= bitsLimit; index++) {
		binaryStrings.add('0'.repeat(index));
	}
	const { withoutPadding } = options;
	for (let i = 0; i < limit; i++) {
		const binaryString = Number(i).toString(2);
		if (withoutPadding) {
			binaryStrings.add(binaryString);
		}
		// Append 0 if the binary string length is less than bits limit
		const paddedBinaryString =
			binaryString.length < bitsLimit
				? '0'.repeat(bitsLimit - binaryString.length) + binaryString
				: binaryString;
		binaryStrings.add(paddedBinaryString);
	}

	return Array.from(binaryStrings);
}
