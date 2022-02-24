import { IAutomatonTestLogicFn, IRegularExpression } from './types';
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

  convertToPostfix() {
    return RegularExpressionUtils.convertInfixRegexToPostfix(String(this.automaton.regex))
  }
}

export { RegularExpressionUtils };

