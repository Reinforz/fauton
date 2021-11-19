/* eslint-disable no-param-reassign, no-console */
import shortid from 'shortid';
import {
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../../types';
import * as FiniteAutomatonUtils from './utils';

export class FiniteAutomaton {
	testLogic: IAutomatonTestLogicFn;

	automaton: TransformedFiniteAutomaton;

	#automatonId: string;

	#automatonType: TFiniteAutomatonType;

	constructor(
		testLogic: IAutomatonTestLogicFn,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		// Validate the automaton passed before normalizing it
		FiniteAutomatonUtils.validate(
			finiteAutomaton.label,
			FiniteAutomatonUtils.generatePreNormalizationErrors(
				testLogic,
				this.#automatonType,
				finiteAutomaton
			)
		);
		this.automaton = FiniteAutomatonUtils.normalize(finiteAutomaton);
		// Validate the automaton passed after normalizing it
		FiniteAutomatonUtils.validate(
			finiteAutomaton.label,
			FiniteAutomatonUtils.generatePostNormalizationErrors(
				finiteAutomaton as TransformedFiniteAutomaton
			)
		);
	}

	getAutomatonId() {
		return this.#automatonId;
	}

	generateGraphFromString(inputString: string) {
		return FiniteAutomatonUtils.generateGraphFromString(this.automaton, inputString);
	}

	test(inputString: string) {
		return this.generateGraphFromString(inputString).automatonTestResult;
	}
}

export { FiniteAutomatonUtils };
