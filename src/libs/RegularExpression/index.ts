import { IAutomatonTestLogicFn, IRegularExpression } from '../../types';
import { NonDeterministicFiniteAutomaton } from '../NonDeterministicFiniteAutomaton';
import * as RegularExpressionUtils from './utils';

export class RegularExpression {
	automaton: IRegularExpression;

	testLogic: IAutomatonTestLogicFn;

	constructor(testLogic: IAutomatonTestLogicFn, automaton: IRegularExpression, flags?: string[]) {
		this.automaton = {
			...automaton,
			regex: new RegExp(automaton.regex, ...(flags ?? [])),
		};
		this.testLogic = testLogic;
	}

	test(inputString: string) {
		return Boolean(inputString.match(this.automaton.regex));
	}

	convertToEpsilonNonDeterministicFiniteAutomaton() {
		return new NonDeterministicFiniteAutomaton(
			this.testLogic,
			RegularExpressionUtils.generateEpsilonNfaFromRegex(
				this.automaton.alphabets,
				this.automaton.regex.toString()
			),
			undefined,
			{
				skipCharacterRangesExpansion: true,
			}
		);
	}
}

export { RegularExpressionUtils };
