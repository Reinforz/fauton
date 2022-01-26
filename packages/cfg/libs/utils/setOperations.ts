export function setDifference(setA: Set<string>, setB: Set<string>) {
	return new Set(Array.from(setA).filter((setAElement) => !setB.has(setAElement)));
}

export function setCrossProduct(setA: Set<string>, setB: Set<string>) {
	const crossProductSet: Set<string> = new Set();
	if (setA.size === 0 || setB.size === 0) return crossProductSet;
	setA.forEach((setAItem) => {
		setB.forEach((setBItem) => crossProductSet.add(`${setAItem} ${setBItem}`));
	});
	return crossProductSet;
}
