/* eslint-disable no-use-before-define */

import { RegexNode } from '../types';

export function generateRegexTreeBinaryOperatorNode(regexString: string): [RegexNode, string] {
	const [rightNode, regex1] = generateRegexTree(regexString.slice(0, regexString.length - 1));
	const [leftNode, regex2] = generateRegexTree(regex1);
	return [
		{
			operator: regexString[regexString.length - 1] === '.' ? 'Concat' : 'Or',
			operands: [leftNode, rightNode],
		},
		regex2,
	];
}

export function generateRegexTreeUnaryOperatorNode(regexString: string): [RegexNode, string] {
	const [childNodes, regex] = generateRegexTree(regexString.slice(0, regexString.length - 1));
	if (regexString[regexString.length - 1] === '*') {
		return [
			{
				operator: 'Kleene',
				operands: [childNodes],
			},
			regex,
		];
	} else if (regexString[regexString.length - 1] === '+') {
		return [
			{
				operator: 'Plus',
				operands: [childNodes],
			},
			regex,
		];
	}
	// TODO: Add support for more operators, like ?
	else {
		return [
			{
				operator: 'Kleene',
				operands: [childNodes],
			},
			regex,
		];
	}
}

export function generateRegexTreeLiteralNode(regexString: string): [RegexNode, string] {
	return [
		{
			operator: 'Literal',
			operands: [regexString[regexString.length - 1]],
		},
		regexString.slice(0, regexString.length - 1),
	];
}

export function generateRegexTree(postfixRegexString: string) {
	const binaryRegexOperators = new Set('.|');
	const unaryRegexOperators = new Set('*+?');
	let result: [RegexNode, string] | null = null;
	if (binaryRegexOperators.has(postfixRegexString[postfixRegexString.length - 1])) {
		result = generateRegexTreeBinaryOperatorNode(postfixRegexString);
	} else if (unaryRegexOperators.has(postfixRegexString[postfixRegexString.length - 1])) {
		result = generateRegexTreeUnaryOperatorNode(postfixRegexString);
	} else {
		result = generateRegexTreeLiteralNode(postfixRegexString);
	}
	return result;
}
