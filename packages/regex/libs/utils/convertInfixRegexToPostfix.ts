function comparePrecedence(topOperatorSymbol: string, operatorSymbol: string) {
	const parenthesisSymbols = new Set('()');
	if (parenthesisSymbols.has(topOperatorSymbol)) {
		return false;
	}
	const precedenceRecord: Record<string, [number, 'r' | 'l']> = {
		'*': [3, 'r'],
		'+': [3, 'r'],
		'?': [3, 'r'],
		'.': [2, 'l'],
		'|': [1, 'l'],
	};

	const [topOperatorPrecedence] = precedenceRecord[topOperatorSymbol];
	const [operatorPrecedence, operatorAssociativity] = precedenceRecord[operatorSymbol];

	if (operatorAssociativity === 'l') {
		return operatorPrecedence <= topOperatorPrecedence;
	} else {
		return operatorPrecedence < topOperatorPrecedence;
	}
}

export function convertInfixRegexToPostfix(regexString: string) {
	const operationsStack: string[] = [];
	let postfixRegexString = '';
	const nonLiteralSymbols = new Set('()*+?|.');
	const parenthesisSymbols = new Set('()');

	for (let index = 0; index < regexString.length; index += 1) {
		const regexSymbol = regexString[index];
		// If its a literal
		if (!nonLiteralSymbols.has(regexSymbol)) {
			postfixRegexString += regexSymbol;
		} else if (regexSymbol === '(') {
			operationsStack.push(regexSymbol);
		} else if (regexSymbol === ')') {
			// Loop until we reach the last ")"
			while (operationsStack.length > 0 && operationsStack[operationsStack.length - 1] !== '(') {
				postfixRegexString += operationsStack.pop();
			}
			// Pop "(" from stack
			operationsStack.pop();
		} else if (operationsStack.length <= 0) {
			operationsStack.push(regexSymbol);
		} else {
			while (operationsStack.length !== 0) {
				const topOperatorSymbol = operationsStack[operationsStack.length - 1];
				const shouldAddToPostfixRegexString = comparePrecedence(topOperatorSymbol, regexSymbol);
				if (shouldAddToPostfixRegexString) {
					postfixRegexString += operationsStack.pop();
				} else {
					break;
				}
			}
			operationsStack.push(regexSymbol);
		}
	}

	while (operationsStack.length !== 0) {
		// Mismatched parenthesis
		if (parenthesisSymbols.has(operationsStack[operationsStack.length - 1])) {
			return postfixRegexString;
		}
		postfixRegexString += operationsStack.pop();
	}
	return postfixRegexString;
}
