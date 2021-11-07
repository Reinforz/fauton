import generateRandomNumber from './generateRandomNumber';

export default function generateRandomBinaryStrings(
	total: number,
	minLength: number,
	maxLength: number
) {
	// Using a set to store only unique binary strings
	const uniqueRandomBinaryStrings: Set<string> = new Set();
	while (uniqueRandomBinaryStrings.size < total) {
		const binaryStringLength = generateRandomNumber(minLength, maxLength);
		let randomBinaryString = '';
		for (let index = 0; index < binaryStringLength; index++) {
			randomBinaryString += generateRandomNumber(0, 1);
		}

		if (!uniqueRandomBinaryStrings.has(randomBinaryString)) {
			console.log(randomBinaryString);
			uniqueRandomBinaryStrings.add(randomBinaryString);
		}
	}
	return Array.from(uniqueRandomBinaryStrings);
}
