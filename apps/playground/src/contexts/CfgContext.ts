import { IContextFreeGrammar } from '@fauton/cfg';
import React, { Dispatch, SetStateAction } from 'react';
import { UserInputGrammar } from '../types';

interface ICfgContext {
  grammars: {
		label: string;
		grammar: IContextFreeGrammar;
	}[]
	currentSelectedGrammar: {
		label: string;
		grammar: IContextFreeGrammar;
	} | null;
	setCurrentSelectedGrammar: Dispatch<
		SetStateAction<{
			label: string;
			grammar: IContextFreeGrammar;
		} | null>
	>;
  addGrammar: ((userInputGrammar: UserInputGrammar) => void)
}

export const CfgContext = React.createContext<ICfgContext>({} as ICfgContext);
