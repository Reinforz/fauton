/* eslint-disable no-use-before-define */

export type UnaryRegexOperators = "+" | "*" | "?";
export type UnaryRegexOperatorsName = "Plus" | "Kleene" | "Optional";
export type BinaryRegexOperators = "." | "|";
export type BinaryRegexOperatorsName = "Concat" | "Or";

export interface UnaryRegexNode<Operator extends UnaryRegexOperatorsName = UnaryRegexOperatorsName> {
  operator: Operator
	operands: [RegexNode];
}

export interface BinaryRegexNode<Operator extends BinaryRegexOperatorsName = BinaryRegexOperatorsName> {
  operator: Operator
	operands: [RegexNode, RegexNode];
}

export interface ConcatRegexNode extends BinaryRegexNode<"Concat"> {}
export interface OrRegexNode extends BinaryRegexNode<"Or"> {}
export interface KleeneRegexNode extends UnaryRegexNode<"Kleene"> {}
export interface OptionalRegexNode extends UnaryRegexNode<"Optional"> {}
export interface PlusRegexNode extends UnaryRegexNode<"Plus"> {}

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
	| OptionalRegexNode
	| OrRegexNode
	| LiteralRegexNode
	| PlusRegexNode;

// eslint-disable-next-line
export type IAutomatonTestLogicFn = (inputString: string, automatonTestResult: boolean) => boolean;
// eslint-disable-next-line
export type IAutomatonTestFn = (inputString: string) => boolean;
