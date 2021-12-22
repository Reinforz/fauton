export interface IContextFreeGrammar {
	variables: string[];
	terminals: string[];
	productionRules: Record<string, string[]>;
	startVariable: string;
}

// eslint-disable-next-line
export type LanguageChecker = (inputString: string) => boolean;

export interface ICfgLanguageGenerationOption {
	minChunkLength: number;
	maxChunkLength: number;
	skipSimplification?: boolean;
	skipValidation?: boolean;
	generateTerminals?: boolean;
	generateVariables?: boolean;
	autoCapitalizeFirstChunk?: boolean;
	useSpaceWhenJoiningChunks?: boolean;
	parseDirection?: 'left' | 'right';
}
