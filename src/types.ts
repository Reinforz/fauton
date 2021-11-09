export interface InputFiniteAutomaton {
	// Append a string to all the states
	append?: string;
	alphabets: string[];
	label: string;
	description?: string;
	start_state: string | number;
	final_states: (string | number)[];
	states: (string | number)[];
	// each key of transitions indicate a state
	transitions: Record<string | number, (Array<string | number> | (string | number))[] | 'loop'>;
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
}

export interface IFiniteAutomaton {
	testLogic: (inputString: string) => boolean;
	automaton: InputFiniteAutomaton;
}

export interface FiniteAutomatonTestInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}

export type TFiniteAutomatonType = 'deterministic' | 'non-deterministic';
export interface GraphNode {
	name: string;
	state: string;
	symbol: null | string;
	children: GraphNode[];
	index: number;
	string: string;
}
