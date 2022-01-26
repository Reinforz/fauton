/**
 * Validates a simple regex consisting of ()|*.+? operators
 * @param regexString Validate regex string
 * @returns Whether the regex is valid or not
 */
export function validateRegex(regexString: string) {
	const operations = new Set(['(', '+', '*', '|', '?']);
	let parenthesisBalance = 0;
	const literals = new Set();
	const noopTokens = [0];

	for (let index = 0; index < regexString.length; index += 1) {
		const regexSymbol = regexString[index];
		switch (regexSymbol) {
			case '(': {
				parenthesisBalance += 1;
				noopTokens.push(0);
				break;
			}
			case ')': {
				parenthesisBalance -= 1;
				// No ( encountered before, so invalid regex
				if (parenthesisBalance < 0) {
					return false;
				}
				// If the last token was "("
				// Parenthesis content can't be empty
				else if (noopTokens[noopTokens.length - 1] === 0) {
					return false;
				} else {
					noopTokens.pop();
				}
				break;
			}

			case '*':
			case '+':
			case '?':
			case '|': {
				// If last token was ( and no literal was found, operators must act on a literal
				if (noopTokens[noopTokens.length - 1] === 0 && literals.size === 0) {
					return false;
				}
				// Two consecutive operations is invalid
				// Operators can't be the first symbol
				else if (index === 0 || operations.has(regexString[index - 1])) {
					return false;
				}

				if (regexSymbol === '|') {
					// | operator can't be the last symbol of regex
					if (index === regexString.length - 1) {
						return false;
					}
					if (noopTokens.length > 1) {
						let rightRegex = '',
							// Checks whether the whole expression is inside parenthesis
							insideParen = false,
							lhsParenCount = 0,
							rhsParenCount = 0;

						// Backtracking from current to first symbol
						for (let j = 0; j < index; j += 1) {
							if (regexString[index - j - 1] === ')') {
								lhsParenCount += 1;
							} else if (regexString[index - j - 1] === '(') {
								lhsParenCount -= 1;
								// We've encountered extra "(" without ")"
								if (lhsParenCount < 0) {
									insideParen = true;
									// extract the left hand side regex
									break;
								}
							}
						}

						if (insideParen) {
							// Extract the rh side regex
							for (let j = index + 1; j < regexString.length; j += 1) {
								if (regexString[j] === ')') {
									rhsParenCount -= 1;
									// We've encountered two ")" without "(""
									if (rhsParenCount < 0) {
										rightRegex = regexString.slice(index + 1, j);
										break;
									}
								} else if (regexString[j] === '(') {
									rhsParenCount += 1;
								}
							}

							// Right hand regex of | cant be empty
							if (rightRegex === '') {
								return false;
							}
						}
						if (validateRegex(rightRegex) === false) {
							return false;
						} else {
							noopTokens[noopTokens.length - 1] += 1;
						}
					}
				}
				break;
			}
			// Non operand characters, literal
			default: {
				literals.add(regexSymbol);
				noopTokens[noopTokens.length - 1] += 1;
			}
		}
	}
	if (parenthesisBalance !== 0) {
		return false;
	}
	return true;
}
