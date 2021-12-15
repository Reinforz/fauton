export function isAllTerminal(terminals: string[], word: string) {
	const terminalsSet = new Set(terminals);
	return word.split('').every((letter) => terminalsSet.has(letter));
}
