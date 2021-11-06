export interface IBinaryDFA {
	label: string;
	start_state: string;
	final_states: string[];
	transitions: Record<
		string,
		{
			0: string;
			1: string;
			isTrap?: boolean;
		}
	>;
}

export interface IDfaTest {
	testLogic: (binary: string) => boolean;
	DFA: IBinaryDFA;
}
