export interface InputFiniteAutomaton {
	// Append a string to all the states
	append?: string;
	alphabets: (string | number)[];
	label: string;
	description?: string;
	start_state: string | number;
	final_states: (string | number)[];
	states: (string | number)[];
	// each key of transitions indicate a state
	transitions: Record<
		string | number,
		(Array<string | number> | (string | number) | null)[] | 'loop'
	>;
	epsilon_transitions?: Record<string, (string | number)[]>;
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
	epsilon_transitions: null | Record<string, string[]>;
}

// eslint-disable-next-line
export type IAutomatonTestLogicFn = (inputString: string, automatonTestResult: boolean) => boolean;
// eslint-disable-next-line
export type IAutomatonTestFn = (inputString: string) => boolean;
export interface IFiniteAutomaton {
	testLogic: IAutomatonTestLogicFn;
	automaton: TransformedFiniteAutomaton;
	automatonId: string;
}

export interface IAutomatonInfo {
	test: IAutomatonTestFn;
	testLogic: IAutomatonTestLogicFn;
	automaton: {
		label: string;
		alphabets: string[];
		description?: string;
	};
}

export type TFiniteAutomatonType = 'deterministic' | 'non-deterministic' | 'epsilon';
export interface GraphNode {
	name: string;
	state: string;
	symbol: null | string;
	children: GraphNode[];
	depth: number;
	string: string;
}

export type GeneratedAutomatonOptions = Partial<
	Pick<Pick<IFiniteAutomaton, 'automaton'>['automaton'], 'label' | 'description'> & {
		separator: string;
	}
>;
export type TMergeOperation = 'or' | 'and' | 'not';

export interface SkipOptions {
	skipValidation: boolean;
	skipNormalization: boolean;
	skipCharacterRangesExpansion: boolean;
}
