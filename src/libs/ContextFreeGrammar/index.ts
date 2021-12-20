import {
	CFGAutomaton,
	IAutomatonInfo,
	IAutomatonTestLogicFn,
	ICfgLanguageGenerationOption,
} from '../../types';
import * as ContextFreeGrammarUtils from './utils';
import { generateCfgLanguage } from './utils/generateCfgLanguage';
import { validateCfg } from './utils/validateCfg';

export { ContextFreeGrammarUtils };

export class ContextFreeGrammar implements IAutomatonInfo {
	testLogic: IAutomatonTestLogicFn;

	automaton: CFGAutomaton & { alphabets: string[] };

	cfgLanguage: Set<string>;

	constructor(
		testLogic: IAutomatonTestLogicFn,
		automaton: CFGAutomaton,
		cfgLanguageGenerationOption: ICfgLanguageGenerationOption
	) {
		validateCfg(automaton);
		this.testLogic = testLogic;
		const { language } = generateCfgLanguage(automaton, cfgLanguageGenerationOption);
		this.cfgLanguage = new Set(language);
		this.automaton = {
			...automaton,
			alphabets: automaton.terminals,
		};
	}

	test(sentence: string) {
		return this.cfgLanguage.has(sentence);
	}
}
