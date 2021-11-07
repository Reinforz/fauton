export interface IBinaryDFA {
	label: string;
	description?: string;
	start_state: string;
	final_states: string[];
	transitions: Record<string, [string, string] | 'loop'>;
}

export interface IDfaModule {
	testLogic: (binary: string) => boolean;
	DFA: IBinaryDFA;
}

export interface IDfaModuleInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}
