/* eslint-disable no-use-before-define */

export interface AutomatonTestInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}

export interface IOutputFiles {
	case: boolean;
	incorrect: boolean;
	correct: boolean;
	input: boolean;
	aggregate: boolean;
	accepted: boolean;
	rejected: boolean;
}

export type InputStringOption =
	| {
			type: 'generate';
			random?: {
				total: number;
				minLength: number;
				maxLength: number;
			};
			combo?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'generate';
			combo: {
				maxLength: number;
				startLength?: number;
			};
			random?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'file';
			filePath: string;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'custom';
			inputs: string[];
			outputFiles?: Partial<IOutputFiles>;
	  };

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
