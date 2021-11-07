export interface IBinaryDFA {
	label: string;
	start_state: string;
	final_states: string[];
	transitions: Record<string, [string, string] | 'loop'>;
}

export interface IDfaTest {
	testLogic: (binary: string) => boolean;
	DFA: IBinaryDFA;
}
