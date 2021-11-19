/**
 * Generates an array of symbols by expanding the character classes string separate by ,
 * @param characterRangesString String containing character classes separated by ,
 * @returns An array of symbols that are present in the character classes
 */
export function expandCharacterRanges(characterRangesString: string) {
	const characterRanges = characterRangesString.split(',');
	const symbols: Set<string> = new Set();
	characterRanges.forEach((characterRange) => {
		const characterRangeRanges = characterRange.split('-');
		if (characterRangeRanges.length === 2) {
			const startCharacter = characterRangeRanges[0].charCodeAt(0);
			const endCharacter = characterRangeRanges[1].charCodeAt(0);
			for (
				let characterCodePoint = startCharacter;
				characterCodePoint <= endCharacter;
				characterCodePoint += 1
			) {
				symbols.add(String.fromCodePoint(characterCodePoint));
			}
		} else {
			// When its a single symbol
			symbols.add(characterRange);
		}
	});
	return Array.from(symbols);
}
