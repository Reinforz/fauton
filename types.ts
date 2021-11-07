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
