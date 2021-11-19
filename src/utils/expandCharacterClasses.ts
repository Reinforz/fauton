/**
 * Generates an array of symbols by expanding the character classes string separate by ,
 * @param characterClassesString String containing character classes separated by ,
 * @returns An array of symbols that are present in the character classes
 */
export function expandCharacterClasses(characterClassesString: string) {
	const characterClasses = characterClassesString.split(',');
	const symbols: Set<string> = new Set();
	characterClasses.forEach((characterClass) => {
		const characterClassRanges = characterClass.split('-');
		const startCharacter = characterClassRanges[0].charCodeAt(0);
		const endCharacter = characterClassRanges[1].charCodeAt(0);
		for (
			let characterCodePoint = startCharacter;
			characterCodePoint <= endCharacter;
			characterCodePoint += 1
		) {
			symbols.add(String.fromCodePoint(characterCodePoint));
		}
	});
	return Array.from(symbols);
}
