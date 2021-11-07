interface IOptions {
	withoutPadding: boolean;
}

export default function generateBinaryStrings(bitsLimit: number, options: IOptions) {
	const binaryStrings: string[] = [];
	const limit = Math.pow(2, bitsLimit);
	const { withoutPadding } = options;
	for (let i = 0; i < limit; i++) {
		const binaryString = Number(i).toString(2);
		// Append 0 if the binary string length is less than bits limit
		if (withoutPadding) {
			binaryStrings.push(binaryString);
		}
		binaryStrings.push(
			binaryString.length < bitsLimit
				? '0'.repeat(bitsLimit - binaryString.length) + binaryString
				: binaryString
		);
	}

	return binaryStrings;
}
