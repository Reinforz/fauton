export interface IContextFreeGrammar {
	variables: string[];
	terminals: string[];
	productionRules: Record<string, string[]>;
	startVariable: string;
}

// Cfg input might not have all the properties, and they could be null as well
export interface IContextFreeGrammarInput {
	variables?: string[] | null;
	terminals?: string[] | null;
	productionRules: Record<string, string[]>;
	startVariable?: string;
}

// eslint-disable-next-line
export type LanguageChecker = (inputString: string) => boolean;

export interface ICfgLanguageGenerationOption {
	minTokenLength: number;
	maxTokenLength: number;
	skipSimplification?: boolean;
	skipValidation?: boolean;
	generateTerminals?: boolean;
	generateVariables?: boolean;
	autoCapitalizeFirstToken?: boolean;
	useSpaceWhenJoiningTokens?: boolean;
	parseDirection?: 'left' | 'right';
}
