/**
 * Checks if all the letters of a word are terminal
 * @param terminals Array of terminals
 * @param word Word that is required to be check
 * @returns True if all the letters of a word are terminals false otherwise
 */
export function isAllTerminal(terminals: string[], word: string) {
	const terminalsSet = new Set(terminals);
	return word.split(' ').every((letter) => terminalsSet.has(letter));
}
