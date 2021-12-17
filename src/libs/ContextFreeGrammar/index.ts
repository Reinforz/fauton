import { CFGAutomaton, IAutomatonInfo, IAutomatonTestLogicFn } from '../../types';
import * as ContextFreeGrammarUtils from './utils';
import { generateCfgLanguage } from './utils/generateCfgLanguage';
import { validateCfg } from './utils/validateCfg';

export { ContextFreeGrammarUtils };

export class ContextFreeGrammar implements IAutomatonInfo {
	testLogic: IAutomatonTestLogicFn;

	automaton: CFGAutomaton & { alphabets: string[] };

	grammarLanguage: Set<string>;

	constructor(testLogic: IAutomatonTestLogicFn, automaton: CFGAutomaton, maxLength: number) {
		validateCfg(automaton);
		this.testLogic = testLogic;
		const grammarLanguage = generateCfgLanguage(automaton, maxLength);
		this.grammarLanguage = new Set(Object.keys(grammarLanguage));
		this.automaton = {
			...automaton,
			alphabets: automaton.terminals,
		};
	}

	test(inputString: string) {
		return this.grammarLanguage.has(inputString);
	}
}
