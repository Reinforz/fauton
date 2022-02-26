/* eslint-disable no-use-before-define */

import { BinaryRegexNode, BinaryRegexOperators, BinaryRegexOperatorsName, RegexNode, UnaryRegexNode, UnaryRegexOperators, UnaryRegexOperatorsName } from '../types';

const RegexOperatorKeywordRecord: Record<UnaryRegexOperators | BinaryRegexOperators, UnaryRegexOperatorsName | BinaryRegexOperatorsName> = {
  ".": "Concat",
  "|": "Or",
  "*": "Kleene",
  "+": "Plus",
};

export function generateRegexTreeBinaryOperatorNode(regexString: string): [RegexNode, string] {
	const [rightNode, regex1] = generateRegexTree(regexString.slice(0, regexString.length - 1));
	const [leftNode, regex2] = generateRegexTree(regex1);

	return [
		{
			operator: RegexOperatorKeywordRecord[regexString[regexString.length - 1] as BinaryRegexOperators],
			operands: [leftNode, rightNode],
		} as BinaryRegexNode,
		regex2,
	];
}

export function generateRegexTreeUnaryOperatorNode(regexString: string): [RegexNode, string] {
	const [childNodes, regex] = generateRegexTree(regexString.slice(0, regexString.length - 1));
  return [
		{
			operator: RegexOperatorKeywordRecord[regexString[regexString.length - 1] as UnaryRegexOperators],
			operands: [childNodes],
		} as UnaryRegexNode,
		regex,
	];
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
  // Set of binary regex operators
	const binaryRegexOperators = new Set('.|');
  // Set of unary regex operators
	const unaryRegexOperators = new Set('*+?');
	let result: [RegexNode, string] | null = null;
  const lastSymbolInPostfixRegexString = postfixRegexString[postfixRegexString.length - 1];
  // Checking for binary operators
	if (binaryRegexOperators.has(lastSymbolInPostfixRegexString)) {
		result = generateRegexTreeBinaryOperatorNode(postfixRegexString);
	} 
  // Checking for unary operators
  else if (unaryRegexOperators.has(lastSymbolInPostfixRegexString)) {
		result = generateRegexTreeUnaryOperatorNode(postfixRegexString);
	} 
  // Checking for regular literals
  else {
		result = generateRegexTreeLiteralNode(postfixRegexString);
	}
	return result;
}
