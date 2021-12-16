export function setDifference(setA: Set<string>, setB: Set<string>) {
	return new Set(Array.from(setA).filter((setAElement) => !setB.has(setAElement)));
}
