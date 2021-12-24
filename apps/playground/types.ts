import { IContextFreeGrammar } from '@fauton/cfg';

export type TGrammarOperations =
	| 'cnf'
	| 'null_remove'
	| 'unit_remove'
	| 'empty_remove'
	| 'useless_remove'
	| 'unreachable_remove'
	| 'non_terminable_remove';

export interface GrammarPipelineStep {
	operation: TGrammarOperations;
	input: IContextFreeGrammar;
	output: IContextFreeGrammar;
}

export type UserInputGrammar = Array<{
	variable: string;
	substitutions: string[][];
}>;
