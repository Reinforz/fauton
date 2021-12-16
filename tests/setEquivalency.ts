export function arrayEquivalency(array1: Array<string>, array2: Array<string>) {
	return setEquivalency(new Set(array1), new Set(array2));
}

export function setEquivalency(set1: Set<string>, set2: Set<string>) {
	if (set1.size !== set2.size) {
		return false;
	} else {
		const set1Array = Array.from(set1);
		return set1Array.every((array1Element) => set2.has(array1Element));
	}
}
