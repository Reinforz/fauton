import { IContextFreeGrammar } from '@fauton/cfg';
import React, { Dispatch, SetStateAction } from 'react';

interface IRootContext {
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
}

export const RootContext = React.createContext<IRootContext>({} as IRootContext);
