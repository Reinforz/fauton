import { DeterministicFiniteAutomaton } from './libs/DeterministicFiniteAutomaton';
import { NonDeterministicFiniteAutomaton } from './libs/NonDeterministicFiniteAutomaton';

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
	transitions: Record<
		string | number,
		(Array<string | number> | (string | number) | null)[] | 'loop'
	>;
	epsilon_transitions?: Record<string, string[]>;
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

export interface IFiniteAutomaton {
	testLogic: (inputString: string) => boolean;
	automaton: TransformedFiniteAutomaton;
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
	depth: number;
	string: string;
}

export interface IOutputFiles {
	case: boolean;
	incorrect: boolean;
	correct: boolean;
	input: boolean;
	aggregate: boolean;
	accepted: boolean;
	rejected: boolean;
}

export type InputStringOption =
	| {
			type: 'generate';
			random?: {
				total: number;
				minLength: number;
				maxLength: number;
			};
			combo?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'generate';
			combo: {
				maxLength: number;
			};
			random?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'file';
			filePath: string;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'custom';
			inputs: string[];
			outputFiles?: Partial<IOutputFiles>;
	  };

export interface IAutomataTestConfig {
	automaton: DeterministicFiniteAutomaton | NonDeterministicFiniteAutomaton;
	options: InputStringOption;
}
