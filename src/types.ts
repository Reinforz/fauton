/* eslint-disable no-use-before-define */
export interface InputFiniteAutomaton {
	// Append a string to all the states
	append?: string;
	alphabets: (string | number)[];
	label: string;
	description?: string;
	start_state: string | number;
	final_states: (string | number)[];
	states: (string | number)[];
	// each key of transitions indicate a state
	transitions: Record<
		string | number,
		(Array<string | number> | (string | number) | null)[] | 'loop'
	>;
	epsilon_transitions?: Record<string, (string | number)[]>;
}

export interface CFGAutomaton extends IContextFreeGrammar {
	label: string;
	description?: string;
}

export interface TransformedFiniteAutomaton {
	append?: string;
	alphabets: string[];
	label: string;
	description?: string;
	start_state: string;
	final_states: string[];
	states: string[];
	// each key of transitions indicate a state, which in turn represents alphabets
	transitions: Record<string, Record<string, string[]>>;
	epsilon_transitions: null | Record<string, string[]>;
}

// eslint-disable-next-line
export type IAutomatonTestLogicFn = (inputString: string, automatonTestResult: boolean) => boolean;
// eslint-disable-next-line
export type IAutomatonTestFn = (inputString: string) => boolean;
export interface IFiniteAutomaton {
	testLogic: IAutomatonTestLogicFn;
	automaton: TransformedFiniteAutomaton;
	automatonId: string;
}

export interface IAutomatonInfo {
	test: IAutomatonTestFn;
	testLogic: IAutomatonTestLogicFn;
	automaton: {
		label: string;
		alphabets: string[];
		description?: string;
	};
}

export interface AutomatonTestInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}

export type TFiniteAutomatonType = 'deterministic' | 'non-deterministic' | 'epsilon';
export interface GraphNode {
	name: string;
	state: string;
	symbol: null | string;
	children: GraphNode[];
	depth: number;
	string: string;
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
	| (
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
			  }
	  ) & {
			// A predicate that checks whether the string should be part of the language
			languageChecker?: LanguageChecker;
	  };

export type GeneratedAutomatonOptions = Partial<
	Pick<Pick<IFiniteAutomaton, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;
export type TMergeOperation = 'or' | 'and' | 'not';

export interface IRegularExpression {
	alphabets: string[];
	regex: RegExp;
	label: string;
	description?: string;
}

export interface SkipOptions {
	skipValidation: boolean;
	skipNormalization: boolean;
	skipCharacterRangesExpansion: boolean;
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

export interface IContextFreeGrammar {
	variables: string[];
	terminals: string[];
	productionRules: Record<string, string[]>;
	startVariable: string;
}

// eslint-disable-next-line
export type LanguageChecker = (inputString: string) => boolean;

export interface ICfgLanguageGenerationOption {
	minLength: number;
	maxLength: number;
	skipSimplification?: boolean;
	skipValidation?: boolean;
	generateTerminals?: boolean;
}
