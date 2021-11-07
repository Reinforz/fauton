export interface InputBinaryDFA {
	append?: string;
	label: string;
	description?: string;
	start_state: string | number;
	final_states: (string | number)[];
	states: (string | number)[];
	transitions: Record<string | number, [string | number, string | number] | 'loop'>;
}

export interface TransformedBinaryDFA {
	append?: string;
	label: string;
	description?: string;
	start_state: string;
	final_states: string[];
	states: string[];
	transitions: Record<string, [string, string] | 'loop'>;
}

export interface IDfaModule {
	testLogic: (binary: string) => boolean;
	DFA: InputBinaryDFA;
}

export interface IDfaModuleInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}
