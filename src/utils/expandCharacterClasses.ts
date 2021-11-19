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
	return symbols;
}
