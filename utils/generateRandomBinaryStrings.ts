import generateRandomNumber from './generateRandomNumber';

export default function generateRandomBinaryStrings(
	total: number,
	minLength: number,
	maxLength: number
) {
	const uniqueStrings: Set<string> = new Set();
	for (let index = 0; index < total; index++) {
		const stringLength = generateRandomNumber(minLength, maxLength);
		let binaryString = '';
		for (let index = 0; index < stringLength; index++) {
			binaryString += generateRandomNumber(0, 1);
		}
		uniqueStrings.add(binaryString);
	}
	return Array.from(uniqueStrings);
}
