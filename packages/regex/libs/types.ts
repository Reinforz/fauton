/* eslint-disable no-use-before-define */

export interface ConcatRegexNode {
	operator: 'Concat';
	operands: [RegexNode, RegexNode];
}

export interface KleeneRegexNode {
	operator: 'Kleene';
	operands: [RegexNode];
}

export interface OrRegexNode {
	operator: 'Or';
	operands: [RegexNode, RegexNode];
}

export interface PlusRegexNode {
	operator: 'Plus';
	operands: [RegexNode];
}

export interface LiteralRegexNode {
	operator: 'Literal';
	operands: [string | number];
}

export interface IRegularExpression {
	alphabets: string[];
	regex: RegExp;
	label: string;
	description?: string;
}

export type RegexNode =
	| ConcatRegexNode
	| KleeneRegexNode
	| OrRegexNode
	| LiteralRegexNode
	| PlusRegexNode;

// eslint-disable-next-line
export type IAutomatonTestLogicFn = (inputString: string, automatonTestResult: boolean) => boolean;
// eslint-disable-next-line
export type IAutomatonTestFn = (inputString: string) => boolean;
