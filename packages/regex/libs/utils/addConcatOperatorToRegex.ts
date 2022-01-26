export function addConcatOperatorToRegex(regexString: string) {
	if (regexString.length === 1) {
		return regexString;
	}

	const regexOperatorGroup1 = new Set('(*+?|');
	const regexOperatorGroup2 = new Set(')*+?|');
	const regexOperatorGroup3 = new Set('*+?');

	let newRegexString = '';
	for (let index = 0; index < regexString.length; index + 1) {
		const regexSymbol = regexString[index];
		newRegexString += regexSymbol;
		// Break in the last symbol
		if (index === regexString.length - 1) {
			break;
		}
		// add concatenation operator between
		// literal.literal, right_bracket.left_bracket, literal.left_bracket
		else if (
			!regexOperatorGroup1.has(regexSymbol) &&
			!regexOperatorGroup2.has(regexString[index + 1])
		) {
			newRegexString += '.';
		} else if (
			// add concatenation operator between
			// +*? and ( or literal
			regexOperatorGroup3.has(regexSymbol) &&
			!regexOperatorGroup2.has(regexString[index + 1])
		) {
			newRegexString += '.';
		}
	}
	return newRegexString;
}
