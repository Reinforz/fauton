import { IContextFreeGrammar } from '@fauton/cfg';

export type TGrammarOperations =
	| 'cnf'
	| 'remove_null'
	| 'remove_unit'
	| 'remove_empty'
	| 'remove_useless'
	| 'remove_unreachable'
	| 'remove_non_terminable';

export interface GrammarPipelineStep {
	operation: TGrammarOperations;
	input: IContextFreeGrammar;
	output: IContextFreeGrammar;
}

export type UserInputGrammar = {
	label: string;
	rules: Array<{
		variable: string;
		substitutions: string[][];
	}>;
};

export type ContextFreeGrammarWithLabel = IContextFreeGrammar & {label: string}