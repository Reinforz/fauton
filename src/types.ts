export interface IBinaryDFA {
	label: string;
	description?: string;
	start_state: string | number;
	final_states: (string | number)[];
	states: (string | number)[];
	transitions: Record<string | number, [string | number, string | number] | 'loop'>;
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
