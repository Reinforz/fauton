import React, { Dispatch, SetStateAction } from 'react';
import { ContextFreeGrammarWithLabel, UserInputGrammar } from '../types';

interface ICfgContext {
  grammars: ContextFreeGrammarWithLabel[]
	currentSelectedGrammar: ContextFreeGrammarWithLabel | null;
	setCurrentSelectedGrammar: Dispatch<
		SetStateAction<ContextFreeGrammarWithLabel | null>
	>;
  addGrammar: ((userInputGrammar: UserInputGrammar) => void)
}

export const CfgContext = React.createContext<ICfgContext>({} as ICfgContext);
