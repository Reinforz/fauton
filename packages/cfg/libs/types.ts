export interface IContextFreeGrammar {
	variables: string[];
	terminals: string[];
	productionRules: Record<string, string[]>;
	startVariable: string;
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
