import { IContextFreeGrammar } from '@fauton/cfg';
import { Theme as MaterialUITheme } from '@mui/material';

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

declare module '@emotion/react' {
  export interface Theme extends MaterialUITheme {}
}