export default function generateBinaryStrings(limit: number) {
	const arr: string[] = [];

	for (let i = 0; i < limit; i++) {
		arr.push(Number(i).toString(2));
	}

	return arr;
}
